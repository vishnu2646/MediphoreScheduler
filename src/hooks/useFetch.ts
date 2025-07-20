import { useState, useEffect } from 'react';
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

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            setState({ data: null, loading: true, error: null });

            try {
                const response = await axios.get<T>(url, config);
                if (!cancelled) {
                    setState({ data: response.data, loading: false, error: null });
                }
            } catch (err: any) {
                if (!cancelled) {
                    setState({
                        data: null,
                        loading: false,
                        error: err?.message || 'Something went wrong',
                });
                }
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [url]);

    return state;
}
