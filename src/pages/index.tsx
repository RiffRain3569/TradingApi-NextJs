import { V } from '@/_ui/index';
import View from '@/components/_layout/client/View';
import AccountPanel from '@/components/client/home/AccountPanel';
import ApiKeyInputPanel from '@/components/client/home/ApiKeyInputPanel';
import TickerPanel from '@/components/client/home/TickerPanel';

const Page = () => {
    return (
        <View>
            <V.Row css={{ gap: 10, margin: '10px 0', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <V.Column css={{ gap: 10 }}>
                    <ApiKeyInputPanel />
                    <AccountPanel />
                </V.Column>
                <TickerPanel />
            </V.Row>
        </View>
    );
};

export default Page;
