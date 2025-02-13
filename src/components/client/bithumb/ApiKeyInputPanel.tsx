import { Button, Panel, Txt } from '@/_ui';
import { Input } from '@/_ui/input/Input';
import { API_KEY_COOKIE_NAME, SECRET_COOKIE_NAME } from '@/constants/common';
import { useMutation } from '@tanstack/react-query';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const ApiKeyInputPanel = () => {
    const { getValues, register, handleSubmit, watch } = useForm({ defaultValues: { apiKey: '', secret: '' } });
    const watchForm = watch();

    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        if (!!getCookie(API_KEY_COOKIE_NAME)) {
            setApiKey(getCookie(API_KEY_COOKIE_NAME) as string);
        }
    }, [getCookie(API_KEY_COOKIE_NAME)]);
    const mutation = useMutation({
        mutationFn: async ({ apiKey, secret }: { apiKey: string; secret: string }) => {
            setCookie(API_KEY_COOKIE_NAME, apiKey);
            setCookie(SECRET_COOKIE_NAME, secret);
        },
        onSuccess: () => {
            alert('등록되었습니다.');
        },
        onError: (error: any) => {
            alert(JSON.stringify(error));
        },
    });

    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleRegister();
        }
    };
    const handleRegister = handleSubmit(() => mutation.mutate(getValues()));

    return (
        <Panel title='API 적용' css={{ minWidth: '300px' }}>
            <Input>
                <Input.TextField placeholder='Key' {...register('apiKey', { required: true })} onKeyUp={handleKeyUp} />
            </Input>
            <Input>
                <Input.TextField
                    type='secret'
                    placeholder='secret'
                    {...register('secret', { required: true })}
                    onKeyUp={handleKeyUp}
                />
            </Input>
            <Button onClick={handleRegister} loading={mutation.isPending}>
                쿠키 등록
            </Button>
            <Button
                onClick={() => {
                    deleteCookie(API_KEY_COOKIE_NAME);
                    deleteCookie(SECRET_COOKIE_NAME);
                }}
                loading={mutation.isPending}
            >
                쿠키 삭제
            </Button>
            {!!apiKey && <Txt>login api: {apiKey}</Txt>}
        </Panel>
    );
};

export default ApiKeyInputPanel;
