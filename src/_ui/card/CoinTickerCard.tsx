import { colors } from '@/components/_layout/client/theme/colors';
import { num2Amt } from '@/utils/amount';
import { css } from '@emotion/react';
import { HTMLAttributes } from 'react';
import { V } from '../div/V';
import Txt from '../typography/Txt';

// 문자열을 숫자 시드로 변환하는 함수 (해시 방식)
const stringToSeed = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

// 시드 기반 난수 생성기 (XOR-Shift 방식)
const seededRandom = (seed: number) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// 시드 기반 랜덤 색상 생성
const getSeededColor = (seed: number, selected: boolean) => {
    const hue = Math.floor(seededRandom(seed) * 360); // 0~360도 색상
    const saturation = 50; // 채도
    const lightness = selected ? 40 : 20; // 명도
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

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
    onClick: () => void;
    selected?: boolean;
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
        onClick,
        selected = false,
        ...rest
    } = props;

    return (
        <V.Column
            {...rest}
            onClick={onClick}
            css={css`
                border: 1px solid #f5f5f5;
                background-color: ${getSeededColor(stringToSeed(market), selected)};
                padding: 8px 12px;
                width: 300px;
                cursor: pointer;

                &:hover {
                    background-color: ${getSeededColor(stringToSeed(market), true)};
                }
            `}
        >
            <V.Row css={{ alignItems: 'center', height: '100%' }}>
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
