import { V } from '@/_ui/index';
import { getCoins, getTicker } from '@/apis/client/bithumb';
import View from '@/components/_layout/client/View';
import AccountPanel from '@/components/client/bithumb/AccountPanel';
import ApiKeyInputPanel from '@/components/client/bithumb/ApiKeyInputPanel';
import DetailPanel from '@/components/client/bithumb/DetailPanel';
import TickerPanel from '@/components/client/bithumb/TickerPanel';
import { targetTickerStore } from '@/store/bithumb';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

const Page = () => {
    const [realtime, setRealtime] = useState(false);
    const [ticker, setTicker] = useRecoilState(targetTickerStore);

    const { data: coins } = useQuery({
        queryKey: ['bithumb_coins'],
        queryFn: async () => {
            const coins = await getCoins({});

            return coins.filter((el: any) => el.market.split('-').at(0) === 'KRW');
        },
    });

    const { data: tickers } = useQuery({
        queryKey: ['bithumb_ticker'],
        queryFn: async () => {
            const tickers = await getTicker({ markets: (coins || []).map((coin: any) => coin.market).join(',') });
            const mergedList = Object.values(
                [...coins, ...tickers].reduce((acc, item) => {
                    acc[item.market] = { ...acc[item.market], ...item };
                    return acc;
                }, {})
            ).filter((el: any) => el.market !== 'KRW-NFT' && el.market !== 'KRW-BTT');

            mergedList.sort((a: any, b: any) => b.signed_change_rate - a.signed_change_rate);

            if (!ticker?.market) {
                setTicker(mergedList.at(0));
            }
            return mergedList;
        },
        enabled: (coins || []).length > 0 && realtime,
        refetchInterval: 200,
    });

    return (
        <View>
            <V.Row css={{ gap: 10, margin: '10px 0', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <V.Column css={{ gap: 10 }}>
                    <ApiKeyInputPanel />
                    <AccountPanel />
                    <DetailPanel ticker={ticker} />
                </V.Column>
                <TickerPanel tickers={tickers || []} onRealtimeClick={(el) => setRealtime(el)} />
            </V.Row>
        </View>
    );
};

export default Page;
