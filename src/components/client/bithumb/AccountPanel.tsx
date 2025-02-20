import { AssetCard, Panel, Txt, V } from '@/_ui';
import { API_KEY_COOKIE_NAME, SECRET_COOKIE_NAME } from '@/constants/common';
import { useWebsocket } from '@/hooks/useWebsocket';
import { assetStore } from '@/store/bithumb';
import { getCookie } from 'cookies-next';
import { memo, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

const AccountPanel = () => {
    const [accountList, setAccountList] = useState<any[]>([]);
    const [asset, setAsset] = useRecoilState(assetStore);

    const { ws, queue, getLastData } = useWebsocket({ exchange: 'bithumb' });

    useEffect(() => {
        // WebSocket 연결이 되어있을 때만 1초마다 메시지를 전송
        if (ws && !!getCookie(API_KEY_COOKIE_NAME)) {
            const interval = setInterval(() => {
                ws.send(
                    JSON.stringify({
                        id: 2,
                        method: 'account',
                        apiKey: getCookie(API_KEY_COOKIE_NAME),
                        secret: getCookie(SECRET_COOKIE_NAME),
                    })
                );
            }, 1000); // 1초마다 메시지 전송

            // 컴포넌트 언마운트 시 interval 해제
            return () => {
                clearInterval(interval);
                console.log('Interval cleared');
            };
        }
    }, [ws, getCookie(API_KEY_COOKIE_NAME)]); // `ws`가 변경될 때마다 실행

    useEffect(() => {
        const data = getLastData(2);
        if (!!data) {
            setAccountList(data.data);
            setAsset(data.data.find((el: any) => el?.currency === 'KRW')?.balance);
        }
    }, [getLastData(2)]);

    const ListItem = memo(({ el }: { el: any }) => {
        return (
            <V.Row css={{ alignItems: 'center', gap: '10px' }}>
                <AssetCard {...el} />
            </V.Row>
        );
    });

    const MemoizedList = memo(() => {
        return (
            <V.Column css={{ gap: '10px' }}>
                {accountList.map((el) => (
                    <ListItem key={el.currency} el={el} />
                ))}
            </V.Column>
        );
    });

    return (
        <Panel title='자산 정보' css={{ width: '100%', maxWidth: '480px' }}>
            <Txt>보유자산: {Math.floor(asset)}</Txt>
            <MemoizedList />
        </Panel>
    );
};

export default AccountPanel;
