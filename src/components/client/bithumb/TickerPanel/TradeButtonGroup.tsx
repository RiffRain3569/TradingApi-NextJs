import { Button, Txt, TxtSpan, V } from '@/_ui';
import { getOrder, getOrderBook, postOrder } from '@/apis/client/bithumb';
import { useMutation } from '@tanstack/react-query';

type Types = {
    market: string;
};
const TradeButtonGroup = ({ market }: Types) => {
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
        <V.Column css={{ gap: '4px', height: '60px' }}>
            <V.Row css={{ gap: '3px', height: '28px' }}>
                <Button
                    color={'bid'}
                    onClick={() => bidMutation.mutate({ market, ord_type: 'price' })}
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
                    onClick={() => bidMutation.mutate({ market, amt: 10000, ord_type: 'price' })}
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
                    onClick={() => bidMutation.mutate({ market, ord_type: 'limit' })}
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
                    onClick={() => askMutation.mutate({ market, ord_type: 'market' })}
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
                    onClick={() => askMutation.mutate({ market, ord_type: 'limit' })}
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
    );
};

export default TradeButtonGroup;
