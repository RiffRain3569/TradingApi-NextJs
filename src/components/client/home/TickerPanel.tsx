import { Button, Panel, Txt, V } from '@/_ui';
import CoinTickerCard from '@/_ui/card/CoinTickerCard';
import { getCoins, getOrder, getTicker, postOrder } from '@/apis/client/bithumb';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const TickerPanel = () => {
    const [coins, setCoins] = useState<any[]>([]);
    const [tickers, setTickers] = useState<any[]>([]);

    const {} = useQuery({
        queryKey: ['coins'],
        queryFn: async () => {
            const coins = await getCoins({});
            setCoins(coins);
        },
    });

    const { refetch } = useQuery({
        queryKey: ['ticker'],
        queryFn: async () => {
            const tickers = await getTicker({ markets: coins.map((coin) => coin.market).join(',') });
            tickers.sort((a: any, b: any) => b.signed_change_rate - a.signed_change_rate);

            setTickers(tickers.filter((el: any) => el.acc_trade_price_24h > 1000000000));
        },
        enabled: coins.length > 0,
        refetchInterval: 1000,
    });

    const mutation = useMutation({
        mutationFn: async ({ market }: { market: string }) => {
            const data = await getOrder({ market });

            const bidOkAsset = data?.bid_account?.balance;
            const bidFee = data?.bid_fee;

            await postOrder({
                market,
                side: 'bid',
                price: `${Math.floor(bidOkAsset) - Math.ceil(bidOkAsset * bidFee) - 1}`,
                ord_type: 'price',
            });
        },
        onSuccess: () => {
            alert('매수 완료');
        },
        onError: (data) => {
            alert(JSON.stringify(data, null, 2));
        },
    });

    return (
        <Panel title='현재가 정보' css={{ maxWidth: '600px' }}>
            <Txt>코인 개수: {tickers.length}</Txt>
            <V.Column css={{ gap: '10px' }}>
                {tickers.map((el, key) => (
                    <V.Row css={{ alignItems: 'center', gap: '10px' }}>
                        <CoinTickerCard key={key} {...el} />

                        <Button onClick={() => mutation.mutate({ market: el.market })}>전액 매수</Button>
                    </V.Row>
                ))}
            </V.Column>
        </Panel>
    );
};

export default TickerPanel;
