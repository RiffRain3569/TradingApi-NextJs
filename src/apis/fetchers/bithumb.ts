import { API_KEY_COOKIE_NAME, SECRET_COOKIE_NAME } from '@/constants/common';
import { GET } from '@/constants/httpMethod';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { parse, stringify } from 'qs';
import { v4 } from 'uuid';

type Types = {
    uri: string;
    method: string;
    reqData?: any;
    options?: any;
    contentType?: string;
};
export const bithumbPublicApi = async ({
    uri,
    method,
    reqData,
    options = {},
    contentType = 'application/json; charset=UTF-8',
}: Types) => {
    return await axios({
        ...options,
        baseURL: 'https://api.bithumb.com',
        url: `${uri}`,
        method: method,
        headers: {
            Accept: 'application/json',
            'Content-Type': contentType,
            'Service-Type': 'api',
        },

        data: method !== GET && reqData ? reqData : '',
        params: method === GET && reqData ? reqData : '',
        paramsSerializer: {
            encode: parse,
            serialize: (params) => stringify(params, { arrayFormat: 'repeat' }),
        },
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw !!error?.code // http 에러 코드
                ? { error: error.code, message: error.message }
                : {
                      error: 'CONNECT_ERROR',
                      message: '통신이 원활하지 않습니다.',
                  };
        });
};

type PrivateTypes = {
    uri: string;
    method: string;
    reqData?: any;
    options?: any;
    contentType?: string;
};
export const bithumbPrivateApi = async ({
    uri,
    method,
    reqData,
    options = {},
    contentType = 'application/json; charset=UTF-8',
}: PrivateTypes) => {
    const apiKey = getCookie(API_KEY_COOKIE_NAME);
    const secret = getCookie(SECRET_COOKIE_NAME);

    if (!apiKey || !secret) {
        alert('ApiKey 와 Secret key를 등록해주세요.');
        throw new Error('ApiKey 와 Secret key를 등록해주세요.');
    }
    const query = stringify(reqData, { encode: true });
    const alg = 'SHA512';
    const hash = crypto.createHash(alg);
    const queryHash = hash.update(query, 'utf-8').digest('hex');

    const payload = {
        access_key: apiKey,
        nonce: v4(),
        timestamp: Date.now(),
        ...(!!reqData && { query_hash: queryHash, query_hash_alg: alg }),
    };

    const token = jwt.sign(payload, secret);

    return await axios({
        ...options,
        baseURL: 'https://api.bithumb.com',
        url: `${uri}`,
        method: method,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': contentType,
            'Service-Type': 'api',
        },

        data: method !== GET && reqData ? reqData : '',
        params: method === GET && reqData ? reqData : '',
        paramsSerializer: {
            encode: parse,
            serialize: (params) => stringify(params, { arrayFormat: 'repeat' }),
        },
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw !!error?.code // http 에러 코드
                ? { error: error.code, message: error.message }
                : {
                      error: 'CONNECT_ERROR',
                      message: '통신이 원활하지 않습니다.',
                  };
        });
};
