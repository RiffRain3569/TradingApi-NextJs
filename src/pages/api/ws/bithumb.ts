import { Server as HttpServer } from 'http';
import { Socket } from 'net';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server, WebSocketServer } from 'ws';

type CustomResponse = NextApiResponse & {
    socket: Socket & {
        server: HttpServer & {
            wss?: WebSocketServer;
        };
    };
};

export default function handler(req: NextApiRequest, res: CustomResponse) {
    if (!res.socket.server.wss) {
        console.log('Initializing WebSocket server...');

        const wss = new Server({ noServer: true });

        res.socket.server.on('upgrade', (request, socket, head) => {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        });

        wss.on('connection', (ws) => {
            console.log('Client connected');

            ws.on('message', (message) => {
                console.log('Received:', message);

                // 모든 클라이언트에게 메시지 전송
                wss.clients.forEach((client) => {
                    if (client.readyState === 1) {
                        client.send(message.toString());
                    }
                });
            });

            ws.on('close', () => console.log('Client disconnected'));
        });

        res.socket.server.wss = wss;
    } else {
        console.log('WebSocket server already running.');
    }

    res.end();
}
