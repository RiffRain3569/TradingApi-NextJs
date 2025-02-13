import { HTMLAttributes } from 'react';

type Types = {
    size?: number;
    weight?: string | number;
} & HTMLAttributes<HTMLParagraphElement>;

const TxtSpan = ({ size = 14, weight, ...props }: Types) => {
    return (
        <span
            css={{
                fontSize: `${(size ?? 14) / 16}rem`,
                fontWeight: weight ?? 'normal',
            }}
            {...props}
        >
            {props.children}
        </span>
    );
};

export default TxtSpan;
