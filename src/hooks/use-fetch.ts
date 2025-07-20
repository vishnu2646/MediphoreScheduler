import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useFetch<T = any>(url: string, config?: AxiosRequestConfig) {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: true,
        error: null,
    });

    const fetchData = useCallback(async () => {
        setState({ data: null, loading: true, error: null });

        try {
            const response = await axios.get<T>(url, config);
            setState({ data: response.data, loading: false, error: null });
        } catch (err: any) {
            setState({
                data: null,
                loading: false,
                error: err?.message || 'Something went wrong',
            });
        }
    }, [url, config]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { ...state, refetch: fetchData };
}