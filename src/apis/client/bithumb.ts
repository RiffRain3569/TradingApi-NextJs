import { GET, POST } from '@/constants/httpMethod';
import { bithumbPrivateApi, bithumbPublicApi } from '../fetchers/bithumb';

export const getCoins = async ({ markets }: { markets?: string }) => {
    return await bithumbPublicApi({
        uri: `/v1/market/all`,
        method: GET,
        reqData: { markets },
    });
};

export const getTicker = async ({ markets }: { markets: string }) => {
    return await bithumbPublicApi({
        uri: `/v1/ticker`,
        method: GET,
        reqData: { markets },
    });
};

export const getAccount = async () => {
    return await bithumbPrivateApi({
        uri: `/v1/accounts`,
        method: GET,
    });
};

export const getOrder = async ({ market }: { market: string }) => {
    return await bithumbPrivateApi({
        uri: `/v1/orders/chance`,
        method: GET,
        reqData: { market },
    });
};

type OrderTypes = {
    market: string;
    side: 'bid' | 'ask'; // 매수, 매도
    volume?: string; // 지장가, 시장가 매도 시 필수
    price?: string; // 지정가, 시장가 매수 시 필수
    ord_type: 'limit' | 'price' | 'market'; // 지정가, 시장가(매수), 시장가(매도)
};

export const postOrder = async ({ ...rest }: OrderTypes) => {
    return await bithumbPrivateApi({
        uri: `/v1/orders`,
        method: POST,
        reqData: { ...rest },
    });
};

export const getOrderBook = async ({ markets }: { markets: string[] }) => {
    return await bithumbPrivateApi({
        uri: `/v1/orderbook`,
        method: GET,
        reqData: { markets: markets.join(',') },
    });
};
