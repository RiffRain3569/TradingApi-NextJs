import { Button, Panel, Txt, V } from '@/_ui';
import View from '@/components/_layout/client/View';
import { useEffect, useRef, useState } from 'react';

const Page = () => {
    const wsRef = useRef<WebSocket | null>(null); // 웹소켓을 한 번만 생성하고 연결

    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        fetch('/api/ws/bithumb');
        const socket = new WebSocket(`ws://localhost:${process.env.WEBSOCKET_PORT}`);
        wsRef.current = socket;

        console.log('Connecting to WebSocket...');
        socket.onopen = () => {
            console.log('Connected to WebSocket');
        };
        socket.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
        };
        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            // 컴포넌트가 언마운트되면 연결 종료
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const sendMessage = () => {
        if (wsRef.current && input) {
            wsRef.current.send(input);
            setInput('');
        }
    };

    return (
        <View>
            <V.Column css={{ gap: 10, margin: '10px 0', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <Panel title={'ws test'}>
                    {messages.map((msg, idx) => (
                        <Txt key={idx}>{msg}</Txt>
                    ))}

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage();
                            }
                        }}
                        placeholder='Type a message...'
                    />

                    <Button onClick={sendMessage}>Send</Button>
                </Panel>
            </V.Column>
        </View>
    );
};

export default Page;
