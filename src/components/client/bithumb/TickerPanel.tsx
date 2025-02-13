import { Button, Panel, Txt, TxtSpan, V } from '@/_ui';
import CoinTickerCard from '@/_ui/card/CoinTickerCard';
import { getCoins, getOrder, getOrderBook, getTicker, postOrder } from '@/apis/client/bithumb';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const TickerPanel = () => {
    const [realtime, setRealtime] = useState(false);
    const [lowTradeShow, setLowTradeShow] = useState(false);
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

            const mergedList = Object.values(
                [...coins, ...tickers].reduce((acc, item) => {
                    acc[item.market] = { ...acc[item.market], ...item };
                    return acc;
                }, {})
            ).filter((el: any) => el.market !== 'KRW-NFT' || el.market !== 'KRW-BTT');

            mergedList.sort((a: any, b: any) => b.signed_change_rate - a.signed_change_rate);

            setTickers(lowTradeShow ? mergedList : mergedList.filter((el: any) => el.acc_trade_price_24h > 1000000000));
        },
        enabled: coins.length > 0 && realtime,
        refetchInterval: 100,
    });

    const bidMutation = useMutation({
        mutationFn: async ({
            market,
            amt,
            ord_type,
        }: {
            market: string;
            amt?: number;
            ord_type: 'limit' | 'price';
        }) => {
            const data = await getOrder({ market });

            const bidOkAsset = data?.bid_account?.balance;
            const bidFee = data?.bid_fee;

            const bidPrice = !amt ? Math.floor(bidOkAsset) - Math.ceil(bidOkAsset * bidFee) - 1 : amt;
            if (ord_type === 'limit') {
                const orderBooks = await getOrderBook({ markets: [market] });
                const price = orderBooks.at(0).orderbook_units.at(0).bid_price;

                await postOrder({
                    market,
                    side: 'bid',
                    volume: `${bidPrice / price}`,
                    price: price,
                    ord_type: ord_type,
                });
            } else {
                await postOrder({
                    market,
                    side: 'bid',
                    volume: '',
                    price: `${bidPrice}`,
                    ord_type: ord_type,
                });
            }
        },
        onSuccess: () => {
            alert('매수 완료');
        },
        onError: (data) => {
            alert(JSON.stringify(data, null, 2));
        },
    });

    const askMutation = useMutation({
        mutationFn: async ({ market, ord_type }: { market: string; ord_type: 'limit' | 'market' }) => {
            const data = await getOrder({ market });

            const askOkBalance = Number(data?.ask_account?.balance);

            const askVolume = askOkBalance;
            if (askOkBalance === 0) {
                throw { error: 'NOT_BALANCE', message: '보유하지 않았습니다.' };
            }
            console.log(data);
            if (ord_type === 'limit') {
                const orderBooks = await getOrderBook({ markets: [market] });
                const price = orderBooks.at(0).orderbook_units.at(0).ask_price;

                await postOrder({
                    market,
                    side: 'ask',
                    volume: `${askVolume}`,
                    price: price,
                    ord_type: ord_type,
                });
            } else {
                await postOrder({
                    market,
                    side: 'ask',
                    volume: `${askVolume}`,
                    price: ``,
                    ord_type: ord_type,
                });
            }
            return 'ok';
        },
        onSuccess: () => {
            alert('매도 완료');
        },
        onError: (data) => {
            alert(JSON.stringify(data, null, 2));
        },
    });

    return (
        <Panel title='현재가 정보' css={{ maxWidth: '720px' }}>
            <V.Row css={{ gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                <Txt>코인 개수: {tickers.length}</Txt>
                <V.Row css={{ gap: '10px' }}>
                    <Button onClick={() => setLowTradeShow((s) => !s)} css={{ width: 'auto' }}>
                        {lowTradeShow ? '1000백만 미만 숨기기' : '1000백만 미만 보이기'}
                    </Button>
                    <Button onClick={() => setRealtime((s) => !s)} css={{ width: 'auto' }}>
                        {realtime ? '실시간 중지' : '실시간 시작'}
                    </Button>
                </V.Row>
            </V.Row>
            <V.Row css={{ gap: '10px' }}>
                <Button onClick={() => setLowTradeShow((s) => !s)} css={{ width: 'auto' }}>
                    상위 5개 코인 20% 분할 매수
                </Button>
            </V.Row>
            <V.Column css={{ gap: '10px' }}>
                {tickers.map((el, key) => (
                    <V.Row css={{ alignItems: 'center', gap: '10px' }}>
                        <CoinTickerCard key={key} {...el} />

                        <V.Column css={{ gap: '4px', height: '60px' }}>
                            <V.Row css={{ gap: '3px', height: '28px' }}>
                                <Button
                                    color={'bid'}
                                    onClick={() => bidMutation.mutate({ market: el.market, ord_type: 'price' })}
                                    css={{
                                        width: 'auto',
                                        minHeight: 'auto',
                                        padding: '6px 10px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <Txt size={12}>
                                        <TxtSpan>전액</TxtSpan> 매수
                                    </Txt>
                                </Button>
                                <Button
                                    color={'bid'}
                                    onClick={() =>
                                        bidMutation.mutate({ market: el.market, amt: 10000, ord_type: 'price' })
                                    }
                                    css={{
                                        width: 'auto',
                                        minHeight: 'auto',
                                        padding: '6px 10px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <Txt size={12}>
                                        <TxtSpan>만원</TxtSpan> 매수
                                    </Txt>
                                </Button>
                                <Button
                                    color={'bid'}
                                    onClick={() => bidMutation.mutate({ market: el.market, ord_type: 'limit' })}
                                    css={{
                                        width: 'auto',
                                        minHeight: 'auto',
                                        padding: '6px 10px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <Txt size={12}>
                                        <TxtSpan>최고 지정가</TxtSpan> 전액 매수
                                    </Txt>
                                </Button>
                            </V.Row>

                            <V.Row css={{ gap: '3px', height: '28px' }}>
                                <Button
                                    color={'ask'}
                                    onClick={() => askMutation.mutate({ market: el.market, ord_type: 'market' })}
                                    css={{
                                        width: 'auto',
                                        minHeight: 'auto',
                                        padding: '6px 10px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <Txt size={12}>
                                        <TxtSpan>전액</TxtSpan> 매도
                                    </Txt>
                                </Button>
                                <Button
                                    color={'ask'}
                                    onClick={() => askMutation.mutate({ market: el.market, ord_type: 'limit' })}
                                    css={{
                                        width: 'auto',
                                        minHeight: 'auto',
                                        padding: '6px 10px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <Txt size={12}>
                                        <TxtSpan>최저 지정가</TxtSpan> 전액 매도
                                    </Txt>
                                </Button>
                            </V.Row>
                        </V.Column>
                    </V.Row>
                ))}
            </V.Column>
        </Panel>
    );
};

export default TickerPanel;
