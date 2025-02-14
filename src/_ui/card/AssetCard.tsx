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
const getSeededColor = (seed: number) => {
    const hue = Math.floor(seededRandom(seed) * 360); // 0~360도 색상
    const saturation = 50; // 채도
    const lightness = 20; // 명도
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

type Types = {
    market: string;
    korean_name: string;
    currency: string;
    balance: number;
} & HTMLAttributes<HTMLDivElement>;

export const AssetCard = (props: Types) => {
    const { market, korean_name, balance, currency, ...rest } = props;

    return (
        <V.Column
            {...rest}
            css={css`
                border: 1px solid #f5f5f5;
                background-color: ${getSeededColor(stringToSeed(currency))};
                padding: 10px 15px;
                height: 60px;
            `}
        >
            <V.Row css={{ width: '300px', alignItems: 'center', gap: '10px', height: '100%' }}>
                <V.Column css={{ width: '100px' }}>
                    <Txt size={12}>{currency}</Txt>
                    <Txt size={10}>{market}</Txt>
                </V.Column>
                <V.Column css={{ width: '200px', alignItems: 'end' }}>
                    <Txt size={12}>{num2Amt(balance)}</Txt>
                </V.Column>
            </V.Row>
        </V.Column>
    );
};

export default AssetCard;
