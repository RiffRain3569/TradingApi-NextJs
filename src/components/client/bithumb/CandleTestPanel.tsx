import { Button, Panel, Txt, V } from '@/_ui';
import { Input } from '@/_ui/input/Input';
import { getCandleMinute } from '@/apis/client/bithumb';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

type Types = {};

const CandleTestPanel = ({}: Types) => {
    const [priceList, setPriceList] = useState<number[]>([0, 0, 0, 0, 0]);
    const [marketList, setMarketList] = useState<string[]>(['', '', '', '', '']);
    const [message, setMessages] = useState<any[]>([]);

    const testMutation = useMutation({
        mutationFn: async () => {
            const to = '2025-02-20 10:00:00';
            const count = 120;
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
                console.group();
                setMessages((s) => [
                    ...s,
                    { market: data.at(0).market, maxPrice, minPrice, endPrice, maxPercent, minPercent, endPercent },
                ]);
            }
        },
    });

    return (
        <Panel title='candle 테스트' css={{ minWidth: '300px' }}>
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
