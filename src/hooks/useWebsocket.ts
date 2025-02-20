import { useEffect, useState } from 'react';

export const useWebsocket = ({ exchange }: { exchange: 'bithumb' }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [queue, setQueue] = useState<any[]>([]);

    useEffect(() => {
        let uri = '';
        let port = '';
        if (exchange === 'bithumb') {
            uri = '/api/ws/bithumb';
            port = process.env.WEBSOCKET_PORT as string;
        }

        fetch(uri);
        const socket = new WebSocket(`ws://localhost:${port}`);

        console.log('Connecting to WebSocket...');
        socket.onopen = () => {
            console.log('Connected to WebSocket');
            setWs(socket);
        };
        socket.onmessage = (event) => {
            setQueue((s) => [...s, JSON.parse(event.data)]);
        };
        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => socket.close();
    }, []);

    const getDataList = (id: number): any[] => {
        const result = queue.filter((el) => el.id === id);
        setQueue((s) => s.filter((el) => el.id !== id));
        return result;
    };

    const getLastData = (id: number): any => {
        const result = queue.filter((el) => el.id === id);
        setQueue((s) => s.filter((el) => el.id !== id));
        return result.length > 0 ? result.at(-1) : undefined;
    };

    return { ws, queue, getLastData, getDataList };
};
