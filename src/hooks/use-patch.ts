import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useState } from "react";

interface PostState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UsePostReturn<T> extends PostState<T> {
    post: (postData?: any, config?: AxiosRequestConfig) => Promise<void>;
}

export function usePatch<T = any>(url: string): UsePostReturn<T> {
    const [state, setState] = useState<PostState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const patch = async (patchData?: any, config?: AxiosRequestConfig): Promise<void> => {
        setState({ data: null, loading: true, error: null });

        try {
            const response: AxiosResponse<T> = await axios.patch<T>(url, patchData, config);
            setState({ data: response.data, loading: false, error: null });
        } catch (err: any) {
            setState({
                data: null,
                loading: false,
                error: err?.response?.data?.message || err?.message || 'Something went wrong',
            });
        }
    };

    return { ...state, post: patch };
}
