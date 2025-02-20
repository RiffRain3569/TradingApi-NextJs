import { V } from '@/_ui/index';
import View from '@/components/_layout/client/View';
import AccountPanel from '@/components/client/bithumb/AccountPanel';
import ApiKeyInputPanel from '@/components/client/bithumb/ApiKeyInputPanel';
import CandleTestPanel from '@/components/client/bithumb/CandleTestPanel';
import DetailPanel from '@/components/client/bithumb/DetailPanel';
import TickerPanel from '@/components/client/bithumb/TickerPanel';
import { useWebsocket } from '@/hooks/useWebsocket';
import { targetTickerStore } from '@/store/bithumb';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

const Page = () => {
    const [tickers, setTickers] = useState<any[]>([]);
    const [ticker, setTicker] = useRecoilState(targetTickerStore);

    const { ws, queue, getLastData } = useWebsocket({ exchange: 'bithumb' });

    useEffect(() => {
        // WebSocket 연결이 되어있을 때만 1초마다 메시지를 전송
        if (ws) {
            const interval = setInterval(() => {
                ws.send(JSON.stringify({ id: 1, method: 'tickers' }));
            }, 1000); // 1초마다 메시지 전송

            // 컴포넌트 언마운트 시 interval 해제
            return () => {
                clearInterval(interval);
                console.log('Interval cleared');
            };
        }
    }, [ws]); // `ws`가 변경될 때마다 실행

    useEffect(() => {
        const data = getLastData(1);
        if (!!data) {
            if (!ticker.market) {
                setTicker(data.data.tickers.at(0));
            }
            setTickers(data.data.tickers);
        }
    }, [getLastData(1)]);

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
                <TickerPanel tickers={tickers} />
                <CandleTestPanel />
            </V.Row>
        </View>
    );
};

export default Page;
