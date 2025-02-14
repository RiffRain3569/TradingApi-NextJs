import { atom } from 'recoil';

export const assetStore = atom({
    key: `bithumbAssetStore`,
    default: 0,
});

export const coinStore = atom<any[]>({
    key: `bithumbCoinStore`,
    default: [],
});

export const tickerStore = atom<any[]>({
    key: `bithumbTickerStore`,
    default: [],
});

export const targetTickerStore = atom<any>({
    key: `bithumbTargetTickerStore`,
    default: {},
});
