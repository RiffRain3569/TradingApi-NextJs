import { colors } from '@/components/_layout/client/theme/colors';
import { num2Amt } from '@/utils/amount';
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
        <V.Column {...rest} css={{ border: `1px solid #f5f5f5`, padding: '10px 15px', height: '60px' }}>
            <V.Row css={{ width: '300px', alignItems: 'center', gap: '10px', height: '100%' }}>
                <V.Column css={{ width: '100px' }}>
                    <Txt size={12}>{korean_name}</Txt>
                    <Txt size={10}>{market}</Txt>
                </V.Column>
                <V.Column css={{ width: '50px', alignItems: 'end' }}>
                    <Txt size={12}>{num2Amt(trade_price)}</Txt>
                </V.Column>
                <V.Column css={{ width: '80px', alignItems: 'end' }}>
                    <Txt
                        size={16}
                        css={{ color: change === 'RISE' ? colors.red : change === 'FALL' ? colors.blue : colors.text }}
                    >
                        {Math.floor(signed_change_rate * 10000) / 100}%
                    </Txt>
                </V.Column>
                <V.Column css={{ width: '80px', alignItems: 'end' }}>
                    <Txt size={12}>{num2Amt(Math.floor(acc_trade_price_24h / 1000000))} 백만</Txt>
                </V.Column>
            </V.Row>
        </V.Column>
    );
};

export default CoinTickerCard;
