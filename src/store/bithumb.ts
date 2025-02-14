import { atom } from 'recoil';

export const assetStore = atom({
    key: `assetStore`,
    default: 0,
});

export const coinTickerStore = atom({
    key: `coinTickerStore`,
    default: {},
});
