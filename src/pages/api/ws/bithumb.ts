import { Server } from 'http';
import { Socket } from 'net';
import { NextApiRequest, NextApiResponse } from 'next';
import { WebSocketServer } from 'ws';

type CustomResponse = NextApiResponse & {
    socket: Socket & {
        server: Server & {
            wss?: WebSocketServer;
        };
    };
};

const GET = async (req: NextApiRequest, res: CustomResponse) => {
    if (!res.socket.server.wss) {
        console.log('🚀 Starting WebSocket server...');
        const wss = new WebSocketServer({ noServer: true });

        wss.on('connection', (ws) => {
            console.log('✅ Client connected');

            // 🔥 5초마다 랜덤 숫자를 클라이언트로 전송
            const interval = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    const data = { timestamp: Date.now(), value: Math.random() };
                    ws.send(JSON.stringify(data));
                    console.log('📤 Sent:', data);
                }
            }, 5000);

            // 연결 종료 시 인터벌 정리
            ws.on('close', () => {
                console.log('🚪 Client disconnected');
                clearInterval(interval);
            });
        });

        res.socket.server.on('upgrade', (request, socket, head) => {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        });

        res.socket.server.wss = wss;
    }

    res.end();
};

export const handler = async (req: NextApiRequest, res: CustomResponse) => {
    console.log(res.socket);
    if (req.method === 'GET') {
        await GET(req, res);
    } else {
        res.status(400).json('not support method');
    }
};

export default handler;

export const config = {
    api: {
        bodyParser: false,
    },
};
