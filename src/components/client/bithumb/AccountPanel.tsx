import { Panel, Txt } from '@/_ui';
import { getAccount } from '@/apis/client/bithumb';
import { API_KEY_COOKIE_NAME, SECRET_COOKIE_NAME } from '@/constants/common';
import { assetStore } from '@/store/bithumb';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

const AccountPanel = () => {
    const [coins, setCoins] = useState<any[]>([]);
    const [asset, setAsset] = useRecoilState(assetStore);

    const { refetch } = useQuery({
        queryKey: ['account'],
        queryFn: async () => {
            const coins = await getAccount();
            setCoins(coins);
            setAsset(coins.filter((el: any) => el?.currency === 'KRW').at(0).balance);
            return 'ok';
        },
        enabled: !!getCookie(API_KEY_COOKIE_NAME) && !!getCookie(SECRET_COOKIE_NAME),
        refetchInterval: 2000,
    });

    return (
        <Panel title='자산 정보' css={{ width: '100%', maxWidth: '480px' }}>
            <Txt>보유자산: {Math.floor(asset)}</Txt>
            {JSON.stringify(coins, null, 4)}
        </Panel>
    );
};

export default AccountPanel;
