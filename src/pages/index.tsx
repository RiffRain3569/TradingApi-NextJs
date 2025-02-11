import { Spinner, V } from '@/_ui/index';
import View from '@/components/_layout/client/View';
import { useEffect, useState } from 'react';

const Page = () => {
    const [isLoad, setLoad] = useState(false);

    useEffect(() => {
        setLoad(true);
    }, []);

    if (!isLoad)
        return (
            <View>
                <Spinner />
            </View>
        );
    return (
        <View>
            <V.Row css={{ gap: 10, margin: '10px 0', flexWrap: 'wrap', alignItems: 'flex-start' }}></V.Row>
        </View>
    );
};

export default Page;
