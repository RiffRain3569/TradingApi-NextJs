import { V } from '@/_ui/index';
import { getCoins, getTicker } from '@/apis/client/bithumb';
import View from '@/components/_layout/client/View';
import AccountPanel from '@/components/client/bithumb/AccountPanel';
import ApiKeyInputPanel from '@/components/client/bithumb/ApiKeyInputPanel';
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
        // 한국 시간 (KST) 오전 6시를 목표로 설정
        const targetHour = 6;
        const targetMinute = 1;
        const targetSecond = 0;

        const checkTimeAndRunTask = () => {
            const currentTime = new Date();

            // 한국 시간(KST) 계산
            const kstOffset = 9 * 60; // 한국은 UTC +9
            const kstTime = new Date(currentTime.getTime());

            const hours = kstTime.getHours();
            const minutes = kstTime.getMinutes();
            const seconds = kstTime.getSeconds();

            if (hours === targetHour && minutes === targetMinute && seconds === targetSecond) {
                console.log('한국시간 오전 6시가 되었습니다. 작업을 실행합니다.');
                runTask();
            }
        };

        const runTask = () => {
            fetch('/api/cron/six-oclock-top5');
        };

        // 1초마다 현재 시간을 확인
        const intervalId = setInterval(checkTimeAndRunTask, 1000);

        // 컴포넌트가 unmount되면 interval을 정리
        return () => clearInterval(intervalId);
    }, []);
    //////////////////////////////////////////

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
