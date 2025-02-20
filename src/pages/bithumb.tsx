import { V } from '@/_ui/index';
import { getCoins, getTicker } from '@/apis/client/bithumb';
import View from '@/components/_layout/client/View';
import AccountPanel from '@/components/client/bithumb/AccountPanel';
import ApiKeyInputPanel from '@/components/client/bithumb/ApiKeyInputPanel';
import CandleTestPanel from '@/components/client/bithumb/CandleTestPanel';
import DetailPanel from '@/components/client/bithumb/DetailPanel';
import TickerPanel from '@/components/client/bithumb/TickerPanel';
import { targetTickerStore } from '@/store/bithumb';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
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

            const sortedList = mergedList.sort((a: any, b: any) => b.signed_change_rate - a.signed_change_rate);

            if (!ticker?.market) {
                setTicker(sortedList.at(0));
            }
            return sortedList;
        },
        enabled: (coins || []).length > 0 && realtime,
        refetchInterval: 200,
    });

    //////////////////////////////////////////
    // test code
    useEffect(() => {
        // cron 돌릴 목표 시간
        const targetHour = 13;
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
        <View>
            <V.Row css={{ gap: 10, margin: '10px 10px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <V.Column css={{ gap: 10 }}>
                    <ApiKeyInputPanel />
                    <AccountPanel />
                    <DetailPanel ticker={ticker} />
                </V.Column>
                <TickerPanel tickers={tickers || []} onRealtimeClick={(el) => setRealtime(el)} />
                <CandleTestPanel />
            </V.Row>
        </View>
    );
};

export default Page;
