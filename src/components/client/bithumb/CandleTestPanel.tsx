import { Button, Panel, Txt } from '@/_ui';
import { Input } from '@/_ui/input/Input';
import { getCandleMinute } from '@/apis/client/bithumb';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

type Types = {};

const CandleTestPanel = ({}: Types) => {
    const [price, setPrice] = useState(0);
    const [market, setMarket] = useState('');
    const [message, setMessages] = useState<any>(undefined);

    const testMutation = useMutation({
        mutationFn: getCandleMinute,
        onSuccess: (data) => {
            const tradePrices = data.map((el: any) => el.trade_price);
            const maxPrice = Math.max(...tradePrices);
            const minPrice = Math.min(...tradePrices);
            const endPrice = tradePrices.at(0);
            console.log(tradePrices, maxPrice, minPrice, endPrice);

            const maxPercent = Math.floor(((maxPrice - price) / price) * 10000) / 100;
            const minPercent = Math.floor(((minPrice - price) / price) * 10000) / 100;
            const endPercent = Math.floor(((endPrice - price) / price) * 10000) / 100;
            setMessages({ maxPercent, minPercent, endPercent });
        },
    });

    return (
        <Panel title='api 테스트' css={{ minWidth: '300px' }}>
            {message && <Txt>{JSON.stringify(message, null, 4)}</Txt>}
            <Input label='market'>
                <Input.TextField onChange={(e) => setMarket(e.target.value)} />
            </Input>
            <Input label='price'>
                <Input.TextField type='number' onChange={(e) => setPrice(Number(e.target.value))} />
            </Input>
            <Button onClick={() => testMutation.mutate({ market: market, to: '2025-02-20 08:01:00', count: 120 })}>
                candle test
            </Button>
        </Panel>
    );
};

export default CandleTestPanel;
