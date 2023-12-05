import { Stack } from '@/utils/stackflow';
import { DehydratedState, Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function App({
    Component,
    pageProps,
}: AppProps<{ dehydratedState: DehydratedState }>) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <>
            <Head>
                <meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
            </Head>
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    <Component {...pageProps} />
                    <Stack />
                </Hydrate>
            </QueryClientProvider>
        </>
    );
}
