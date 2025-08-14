import useSWR from 'swr';
import type { NeoItem } from './types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useNeo(start: string, end: string) {
  const { data, error, isLoading } =
    useSWR<{ items: NeoItem[] }>(`/api/neo?start=${start}&end=${end}`, fetcher, {
      revalidateOnFocus: false,
    });

  return { items: data?.items ?? [], error, isLoading };
}
