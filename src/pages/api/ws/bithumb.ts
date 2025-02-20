import { getAccount, getMarket, getTicker } from '@/apis/client/bithumb';
import { Server as HttpServer } from 'http';
import { Socket } from 'net';
import { NextApiRequest, NextApiResponse } from 'next';
import { WebSocketServer } from 'ws';
type CustomResponse = NextApiResponse & {
    socket: Socket & {
        server: HttpServer & {
            wss?: WebSocketServer;
        };
    };
};

export default function handler(req: NextApiRequest, res: CustomResponse) {
    if (!res.socket?.server?.wss) {
        console.log('🚀🚀🚀🚀🚀 Initializing WebSocket server...');

        // 웹소켓 서버 초기화
        const wss = new WebSocketServer({ port: Number(process.env.WEBSOCKET_PORT) });

        console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀');
        // 서버가 업그레이드 요청을 처리하도록 설정
        res.socket.server.on('upgrade', (request, socket, head) => {
            // Next.js의 HMR 요청 무시
            if (request.url?.includes('/_next/webpack-hmr')) {
                socket.destroy();
                return;
            }

            // WebSocket 서버가 연결을 처리
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        });

        // WebSocket 연결 처리
        wss.on('connection', (ws) => {
            console.log('Client connected');

            // // 일정 시간마다 데이터를 보내기 위한 interval 설정 (예: 5초마다)
            // const interval = setInterval(() => {
            //     if (ws.readyState === 1) {
            //         getMessage().then((data) => ws.send(JSON.stringify(data)));
            //     }
            // }, 5000); // 0.1 초마다 실행

            // 메시지 받으면 실행
            ws.on('message', async (message) => {
                const { id, method, apiKey, secret } = JSON.parse(`${message}`);

                if (method === 'tickers') {
                    ws.send(JSON.stringify({ id, data: await sendTickers() }));
                } else if (method === 'account') {
                    ws.send(JSON.stringify({ id, data: await sendAccount({ apiKey, secret }) }));
                } else {
                    {
                        ws.send(JSON.stringify({ id, message: 'not method' }));
                    }
                }
            });

            ws.on('close', () => {
                console.log('🚪🚪🚪🚪🚪 Client disconnected');
                // clearInterval(interval);
            });
        });

        res.socket.server.wss = wss;
    } else {
        console.log('❌❌❌❌❌ WebSocket server already running.');
    }

    res.end();
}

const sendTickers = async () => {
    const markets = (await getMarket({})).filter((el: any) => el.market.split('-').at(0) === 'KRW');

    const tickers = await getTicker({ markets: (markets || []).map((coin: any) => coin.market).join(',') });
    const mergedList = Object.values(
        [...markets, ...tickers].reduce((acc, item) => {
            acc[item.market] = { ...acc[item.market], ...item };
            return acc;
        }, {})
    ).filter((el: any) => el.market !== 'KRW-NFT' && el.market !== 'KRW-BTT');

    const sortedList = mergedList.sort((a: any, b: any) => b.signed_change_rate - a.signed_change_rate);

    return {
        markets: markets,
        tickers: sortedList,
    };
};

const sendAccount = async ({ apiKey, secret }: { apiKey: string; secret: string }) => {
    return await getAccount({ apiKey, secret });
};
