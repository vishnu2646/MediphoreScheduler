import { useState } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface PostState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UsePostReturn<T> extends PostState<T> {
    post: (postData?: any, config?: AxiosRequestConfig) => Promise<void>;
}

export function usePost<T = any>(): UsePostReturn<T> {
    const [state, setState] = useState<PostState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const post = async (url: string, postData?: any, config?: AxiosRequestConfig): Promise<void> => {
        setState({ data: null, loading: true, error: null });

        try {
            const response: AxiosResponse<T> = await axios.post<T>(url, postData, config);
            setState({ data: response.data, loading: false, error: null });
        } catch (err: any) {
            setState({
                data: null,
                loading: false,
                error: err?.response?.data?.message || err?.message || 'Something went wrong',
            });
        }
    };

    return { ...state, post };
}