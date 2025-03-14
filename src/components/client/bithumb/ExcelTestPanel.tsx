import { Button, Panel, Txt, V } from '@/_ui';
import { Input } from '@/_ui/input/Input';
import { getCandleMinute } from '@/apis/client/bithumb';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormTypes = {
    date: string;
    items: {
        hour: number;
        count: number;
        markets: string;
    }[];
};

type DataTypes = {
    hour: number;
    markets: {
        market: string;
        korean_name: string;
        trade_price: number;
        change_rate: string;
        candle: any[];
    }[];
};

type CsvTypes = {
    hour: number;
    markets: {
        korean_name: string;
        trade_price: number;
        maxPercent: number;
        minPercent: number;
        endPercent: number;
    }[];
};

type Types = {};

const ExcelTestPanel = ({}: Types) => {
    const validHour = [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

    const { getValues, register, setValue, handleSubmit, watch } = useForm<FormTypes>({
        defaultValues: {
            date: new Date().toISOString().slice(0, 10),
            items: Array.from({ length: 18 }, (_, idx) => ({ hour: validHour.at(idx), count: 120, markets: '' })),
        },
    });

    const [message, setMessages] = useState<any[]>([]);

    const mutationFunction = async () => {
        let result = [] as DataTypes[];

        for (const { hour, count, markets } of getValues('items')) {
            if (!markets) {
                result.push({} as any);
                continue;
            }
            const marketList = JSON.parse(markets);
            let hourItem = {
                hour,
                markets: marketList,
            };
            for (const [index, { market }] of marketList.entries()) {
                hourItem.markets[index].candle = await getCandleMinute({
                    market,
                    to: `${getValues('date')} ${`${hour + 2}`.padStart(2, '0')}:00:00`,
                    count,
                });
            }
            result.push(hourItem);
        }
        setMessages([]);
        return result;
    };

    const testMutation = useMutation({
        mutationFn: mutationFunction,
        onSuccess: (dataList) => {
            let excelData = [] as CsvTypes[];
            for (const { hour, markets } of dataList) {
                if (!markets) {
                    excelData.push({} as any);
                    continue;
                }
                let hourList = [] as any[];
                for (const { korean_name, trade_price, candle } of markets) {
                    const candleTradePrices = candle.map((el: any) => el.trade_price);
                    const maxPrice = Math.max(...candleTradePrices);
                    const minPrice = Math.min(...candleTradePrices);
                    const endPrice = candleTradePrices.at(0);
                    // console.log(candle, maxPrice, minPrice, endPrice);

                    const maxPercent = Math.floor(((maxPrice - trade_price) / trade_price) * 10000) / 100;
                    const minPercent = Math.floor(((minPrice - trade_price) / trade_price) * 10000) / 100;
                    const endPercent = Math.floor(((endPrice - trade_price) / trade_price) * 10000) / 100;
                    hourList.push({ korean_name, trade_price, maxPercent, minPercent, endPercent });
                }
                excelData.push({ hour, markets: hourList });
            }
            setMessages(excelData);

            const csvData = excelData
                .filter((el) => !!el.hour)
                .map(
                    ({ hour, markets }) =>
                        `${hour}시 시트,${markets
                            .map(
                                ({ korean_name, trade_price, maxPercent, minPercent, endPercent }) =>
                                    `"${korean_name}\n${trade_price}",${maxPercent}%,${minPercent}%,${endPercent}%`
                            )
                            .join(',')}`
                )
                .join('\n');
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${getValues('date')}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        onError: (error: any) => {
            alert(JSON.stringify(error));
        },
    });

    return (
        <Panel title='excel 테스트' css={{ minWidth: '480px' }}>
            <Input label={`date`}>
                <Input.TextField
                    placeholder='yyyy-MM-dd'
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    {...register(`date`)}
                />
            </Input>
            {(getValues('items') || []).map((_: any, key: number) => (
                <V.Row key={key} css={{ padding: '10px', border: '1px solid white', gap: 10 }}>
                    <V.Column css={{ width: '200px' }}>
                        <Input label={`hour`}>
                            <Input.TextField type='number' {...register(`items.${key}.hour`)} disabled />
                        </Input>
                        <Input label={`count`}>
                            <Input.TextField
                                type='number'
                                placeholder='0'
                                defaultValue={120}
                                {...register(`items.${key}.count`)}
                            />
                        </Input>
                        <Input label={`markets jsonString`}>
                            <Input.TextField placeholder='{}' defaultValue={''} {...register(`items.${key}.markets`)} />
                        </Input>
                    </V.Column>
                    {message.length > 0 && (
                        <V.Column css={{ padding: '10px', border: '1px solid white' }}>
                            <Txt css={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(message.at(key), null, 4)}</Txt>
                        </V.Column>
                    )}
                </V.Row>
            ))}
            <Button onClick={() => testMutation.mutate()} loading={testMutation.isPending}>
                candle test
            </Button>
        </Panel>
    );
};

export default ExcelTestPanel;
