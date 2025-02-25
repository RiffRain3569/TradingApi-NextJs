import { Button, Panel, Txt, V } from '@/_ui';
import { Input } from '@/_ui/input/Input';
import { getCandleMinute } from '@/apis/client/bithumb';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type Types = {};

const CandleTestPanel = ({}: Types) => {
    const [to, setTo] = useState('2025-02-22 06:01:00');
    const [count, setCount] = useState(120);
    const [priceList, setPriceList] = useState<number[]>([0, 0, 0, 0, 0]);
    const [marketList, setMarketList] = useState<string[]>(['', '', '', '', '']);
    const [message, setMessages] = useState<any[]>([]);

    const testMutation = useMutation({
        mutationFn: async () => {
            let result = [];

            for (const market of marketList) {
                result.push(await getCandleMinute({ market, to, count }));
            }
            setMessages([]);
            return result;
        },
        onSuccess: (dataList) => {
            for (const [index, data] of dataList.entries()) {
                const tradePrices = data.map((el: any) => el.trade_price);
                const maxPrice = Math.max(...tradePrices);
                const minPrice = Math.min(...tradePrices);
                const endPrice = tradePrices.at(0);
                console.log(data, maxPrice, minPrice, endPrice);

                const maxPercent = Math.floor(((maxPrice - priceList[index]) / priceList[index]) * 10000) / 100;
                const minPercent = Math.floor(((minPrice - priceList[index]) / priceList[index]) * 10000) / 100;
                const endPercent = Math.floor(((endPrice - priceList[index]) / priceList[index]) * 10000) / 100;
                setMessages((s) => [
                    ...s,
                    {
                        market: data.at(0).market,
                        endPrice,
                        maxPercent,
                        minPercent,
                        endPercent,
                        copy: `     ${maxPercent}%, ${minPercent}%, ${endPercent}%     `,
                    },
                ]);
            }
        },
    });

    //////////////////////////////////////////
    // test code
    useEffect(() => {
        // cron 돌릴 목표 시간
        const targetHour = 6;
        const targetMinute = 1;
        const targetSecond = 0;

        const checkTimeAndRunTask = () => {
            const kstTime = new Date();

            const hours = kstTime.getHours();
            const minutes = kstTime.getMinutes();
            const seconds = kstTime.getSeconds();

            if (hours === targetHour && minutes === targetMinute && seconds === targetSecond) {
                runTask();
            }
        };

        const runTask = () => {
            fetch('/api/cron/top5');
        };

        // 1초마다 현재 시간을 확인
        const intervalId = setInterval(checkTimeAndRunTask, 1000);

        // 컴포넌트가 unmount되면 interval을 정리
        return () => clearInterval(intervalId);
    }, []);
    //////////////////////////////////////////

    return (
        <Panel title='candle 테스트' css={{ minWidth: '300px' }}>
            <Input label={`to`}>
                <Input.TextField
                    placeholder='yyyy-MM-dd HH:mm:ss'
                    defaultValue={to}
                    onChange={(e) => setTo(e.target.value)}
                />
            </Input>
            <Input label={`count`}>
                <Input.TextField
                    type='number'
                    placeholder='0'
                    defaultValue={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                />
            </Input>
            {marketList.map((_: any, key: number) => (
                <V.Row key={key} css={{ padding: '10px', border: '1px solid white', gap: 10 }}>
                    <V.Column css={{ width: '200px' }}>
                        <Input label={`market ${key + 1}`}>
                            <Input.TextField
                                onChange={(e) =>
                                    setMarketList((s) => {
                                        s[key] = e.target.value;
                                        return s;
                                    })
                                }
                            />
                        </Input>
                        <Input label={`price ${key + 1}`}>
                            <Input.TextField
                                type='number'
                                onChange={(e) =>
                                    setPriceList((s) => {
                                        s[key] = Number(e.target.value);
                                        return s;
                                    })
                                }
                            />
                        </Input>
                    </V.Column>
                    {message.length > 0 && (
                        <V.Column css={{ padding: '10px', border: '1px solid white' }}>
                            <Txt css={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(message.at(key), null, 4)}</Txt>
                        </V.Column>
                    )}
                </V.Row>
            ))}
            <Button onClick={() => testMutation.mutate()}>candle test</Button>
        </Panel>
    );
};

export default CandleTestPanel;
