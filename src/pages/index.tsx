import { Button, Panel, Txt } from '@/_ui';
import View from '@/components/_layout/client/View';
import { useEffect, useState } from 'react';

const Page = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000/api/ws/bithumb');

        console.log('Connecting to WebSocket...');
        socket.onopen = () => console.log('Connected to WebSocket');
        socket.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
        };
        socket.onclose = () => console.log('WebSocket disconnected');

        setWs(socket);

        return () => socket.close();
    }, []);

    const sendMessage = () => {
        if (ws && input) {
            ws.send(input);
            setInput('');
        }
    };

    return (
        <View>
            <Panel>
                {messages.map((msg, idx) => (
                    <Txt key={idx}>{msg}</Txt>
                ))}
            </Panel>

            <Panel>
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder='Type a message...' />

                <Button onClick={sendMessage}>Send</Button>
            </Panel>
        </View>
    );
};

export default Page;
