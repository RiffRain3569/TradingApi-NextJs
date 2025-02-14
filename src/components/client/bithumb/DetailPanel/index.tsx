import { Panel } from '@/_ui';
import TradeButtonGroup from './TradeButtonGroup';

type Types = {
    ticker: any;
};

const DetailPanel = ({ ticker }: Types) => {
    return (
        <Panel title={`${ticker?.korean_name ?? '코인을 선택해 주세요.'}`} css={{ maxWidth: '720px' }}>
            {!!ticker?.market && <TradeButtonGroup market={ticker?.market} />}
        </Panel>
    );
};

export default DetailPanel;
