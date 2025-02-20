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
            setQueue((s) => {
                const data = JSON.parse(event.data);
                // 기존 아이템에서 id가 중복되는 경우, 덮어쓰기
                const updatedItems = s.map((el) => (el.id === data.id ? { ...el, ...data } : el));

                // 새로운 id인 경우 리스트에 추가
                if (!updatedItems.some((el) => el.id === data.id)) {
                    updatedItems.push(data);
                }

                return updatedItems;
            });
        };
        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => socket.close();
    }, []);

    const getLastData = (id: number): any => {
        return queue.find((el) => el.id === id);
    };

    return { ws, queue, getLastData };
};
