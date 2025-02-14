import { AssetCard, Panel, Txt, V } from '@/_ui';
import { getAccount } from '@/apis/client/bithumb';
import { API_KEY_COOKIE_NAME, SECRET_COOKIE_NAME } from '@/constants/common';
import { assetStore } from '@/store/bithumb';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { useRecoilState } from 'recoil';

const AccountPanel = () => {
    const [asset, setAsset] = useRecoilState(assetStore);

    const { data, refetch } = useQuery({
        queryKey: ['account'],
        queryFn: async () => {
            const coins = await getAccount();
            setAsset(coins.filter((el: any) => el?.currency === 'KRW').at(0).balance);
            return coins;
        },
        enabled: !!getCookie(API_KEY_COOKIE_NAME) && !!getCookie(SECRET_COOKIE_NAME),
        refetchInterval: 2000,
    });

    return (
        <Panel title='자산 정보' css={{ width: '100%', maxWidth: '480px' }}>
            <Txt>보유자산: {Math.floor(asset)}</Txt>

            <V.Column css={{ gap: '10px' }}>
                {(data || []).map((el: any, key: number) => (
                    <V.Row key={key} css={{ alignItems: 'center', gap: '10px' }}>
                        <AssetCard {...el} />
                    </V.Row>
                ))}
            </V.Column>
        </Panel>
    );
};

export default AccountPanel;
