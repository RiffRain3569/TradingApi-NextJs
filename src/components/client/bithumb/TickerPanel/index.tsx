import { Button, Panel, Txt, V } from '@/_ui';
import CoinTickerCard from '@/_ui/card/CoinTickerCard';
import { getCoins, getTicker } from '@/apis/client/bithumb';
import { coinTickerStore } from '@/store/bithumb';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import TradeButtonGroup from './TradeButtonGroup';

const TickerPanel = () => {
    const [realtime, setRealtime] = useState(false);
    const [lowTradeShow, setLowTradeShow] = useState(true);
    const setGlobalTickers = useSetRecoilState(coinTickerStore);

    const { data: coins } = useQuery({
        queryKey: ['coins'],
        queryFn: async () => {
            const coins = await getCoins({});
            return coins.filter((el: any) => el.market.split('-').at(0) === 'KRW');
        },
    });

    const { data: tickers, refetch } = useQuery({
        queryKey: ['ticker'],
        queryFn: async () => {
            const tickers = await getTicker({ markets: (coins || []).map((coin: any) => coin.market).join(',') });
            const mergedList = Object.values(
                [...coins, ...tickers].reduce((acc, item) => {
                    acc[item.market] = { ...acc[item.market], ...item };
                    return acc;
                }, {})
            ).filter((el: any) => el.market !== 'KRW-NFT' || el.market !== 'KRW-BTT');

            mergedList.sort((a: any, b: any) => b.signed_change_rate - a.signed_change_rate);

            setGlobalTickers(mergedList);
            return lowTradeShow ? mergedList : mergedList.filter((el: any) => el.acc_trade_price_24h > 1000000000);
        },
        enabled: (coins || []).length > 0 && realtime,
        refetchInterval: 200,
    });

    return (
        <Panel title='현재가 정보' css={{ maxWidth: '720px' }}>
            <V.Row css={{ gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                <Txt>코인 개수: {(tickers || []).length}</Txt>
                <V.Row css={{ gap: '10px' }}>
                    <Button onClick={() => setLowTradeShow((s) => !s)} css={{ width: 'auto' }}>
                        {lowTradeShow ? '1000백만 미만 숨기기' : '1000백만 미만 보이기'}
                    </Button>
                    <Button onClick={() => setRealtime((s) => !s)} css={{ width: 'auto' }}>
                        {realtime ? '실시간 중지' : '실시간 시작'}
                    </Button>
                </V.Row>
            </V.Row>
            {/* <V.Row css={{ gap: '10px' }}>
                <Button onClick={() => setLowTradeShow((s) => !s)} css={{ width: 'auto' }}>
                    상위 5개 코인 20% 분할 매수
                </Button>
            </V.Row> */}
            <V.Column css={{ gap: '10px' }}>
                {(tickers || []).map((el: any, key: number) => (
                    <V.Row key={key} css={{ alignItems: 'center', gap: '10px' }}>
                        <CoinTickerCard {...el} />
                        <TradeButtonGroup market={el.market} />
                    </V.Row>
                ))}
            </V.Column>
        </Panel>
    );
};

export default TickerPanel;
