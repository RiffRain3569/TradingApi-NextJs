import { getMarket, getTicker } from '@/apis/client/bithumb';
import { NextApiRequest, NextApiResponse } from 'next';

export const revalidate = 0;

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('Cron job is running...');
    const markets = (await getMarket({})).filter((el: any) => el.market.split('-').at(0) === 'KRW');
    const tickers = await getTicker({ markets: (markets || []).map((coin: any) => coin.market).join(',') });

    const mergedList = Object.values(
        [...markets, ...tickers].reduce((acc, item) => {
            acc[item.market] = { ...acc[item.market], ...item };
            return acc;
        }, {})
    ).filter((el: any) => el.market !== 'KRW-NFT' && el.market !== 'KRW-BTT');

    const sortedList = mergedList.sort((a: any, b: any) => b.signed_change_rate - a.signed_change_rate);

    console.log(
        sortedList
            .map(({ market, korean_name, trade_price, change_rate }: any) => ({
                market,
                korean_name,
                trade_price,
                change_rate: `${Math.floor(change_rate * 10000) / 100}%`,
            }))
            .splice(0, 5)
    );

    res.status(200).json({ message: 'Task executed' });
};

export default handler;
