import { Button, Panel, Txt, V } from '@/_ui';
import CoinTickerCard from '@/_ui/card/CoinTickerCard';
import { targetTickerStore } from '@/store/bithumb';
import { memo, useState } from 'react';
import { useRecoilState } from 'recoil';

type Types = {
    tickers: any[];
};

const TickerPanel = ({ tickers: _tickers }: Types) => {
    const [lowTradeShow, setLowTradeShow] = useState(true);
    const [targetTicker, setTargetTicker] = useRecoilState(targetTickerStore);

    const tickers = lowTradeShow ? _tickers : _tickers.filter((el: any) => el.acc_trade_price_24h > 1000000000);

    const ListItem = memo(({ el }: { el: any }) => {
        return (
            <CoinTickerCard {...el} onClick={() => setTargetTicker(el)} selected={targetTicker.market === el.market} />
        );
    });

    const MemoizedList = memo(() => {
        return (
            <V.Column css={{ gap: '5px', height: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                {(tickers || []).map((el: any) => (
                    <ListItem key={el.market} el={el} />
                ))}
            </V.Column>
        );
    });

    return (
        <Panel title='현재가 정보' css={{ maxWidth: '720px', width: 'auto' }}>
            <V.Row css={{ gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                <Txt>코인 개수: {(tickers || []).length}</Txt>
                <V.Row css={{ gap: '10px' }}>
                    <Button onClick={() => setLowTradeShow((s) => !s)} css={{ width: 'auto' }}>
                        {lowTradeShow ? '1000백만 미만 숨기기' : '1000백만 미만 보이기'}
                    </Button>
                </V.Row>
            </V.Row>
            <MemoizedList />
        </Panel>
    );
};

export default TickerPanel;
