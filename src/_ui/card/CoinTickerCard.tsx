import { colors } from '@/components/_layout/client/theme/colors';
import { HTMLAttributes } from 'react';
import { V } from '../div/V';
import Txt from '../typography/Txt';

type Types = {
    market: string;
    korean_name: string;
    opening_price: number;
    high_price: number;
    low_price: number;
    trade_price: number;
    prev_closing_price: number;
    change: string;
    change_price: number;
    change_rate: number;
    signed_change_rate: number;
    acc_trade_price_24h: number;
    acc_trade_volume_24h: number;
} & HTMLAttributes<HTMLDivElement>;

export const CoinTickerCard = (props: Types) => {
    const {
        market,
        korean_name,
        opening_price,
        high_price,
        low_price,
        trade_price,
        prev_closing_price,
        change,
        change_price,
        change_rate,
        signed_change_rate,
        acc_trade_price_24h,
        acc_trade_volume_24h,
        ...rest
    } = props;

    return (
        <V.Column {...rest} css={{ border: `1px solid #f5f5f5`, padding: '10px 15px' }}>
            <V.Row css={{ width: '300px', alignItems: 'center', gap: '10px' }}>
                <V.Column css={{ width: '150px' }}>
                    <Txt>{korean_name}</Txt>
                </V.Column>
                <V.Column css={{ width: '50px', alignItems: 'center' }}>
                    <Txt>{trade_price}</Txt>
                </V.Column>
                <V.Column css={{ width: '100px', alignItems: 'end' }}>
                    <Txt
                        size={20}
                        css={{ color: change === 'RISE' ? colors.red : change === 'FALL' ? colors.blue : colors.text }}
                    >
                        {Math.floor(signed_change_rate * 10000) / 100}%
                    </Txt>
                </V.Column>
                {/* <V.Column>
                    <Txt>시가: {opening_price.toPrecision(1)}</Txt>
                    <Txt>고가: {high_price.toPrecision(1)}</Txt>
                    <Txt>저가: {low_price.toPrecision(1)}</Txt>
                    <Txt>종가: {trade_price.toPrecision(1)}</Txt>
                    <Txt>전일 종가: {prev_closing_price.toPrecision(1)}</Txt>
                </V.Column> */}
            </V.Row>
            {/* <V.Column>
                <Txt>누적 거래 대금: {acc_trade_price_24h}</Txt>
                <Txt>누적 거래량: {acc_trade_volume_24h}</Txt>
            </V.Column> */}
        </V.Column>
    );
};

export default CoinTickerCard;
