import View from '@/components/_layout/client/View';
import { useEffect, useState } from 'react';

const Page = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000/api/ws/bithumb');

        socket.onopen = () => console.log('Connected to WebSocket server');
        socket.onmessage = (event) => setMessages((prev) => [...prev, event.data]);
        socket.onclose = () => console.log('WebSocket closed');

        setWs(socket);

        return () => socket.close();
    }, []);

    const sendMessage = () => {
        if (ws && input.trim()) {
            ws.send(input);
            setInput('');
        }
    };

    return (
        <View>
            <div></div>
        </View>
    );
};

export default Page;
