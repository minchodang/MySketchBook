import { useState } from 'react';
import {
    DehydratedState,
    HydrationBoundary,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import Head from 'next/head';

const App = ({ Component, pageProps }: AppProps<{ dehydratedState: DehydratedState }>) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                        staleTime: 60 * 3 * 1000,
                    },
                },
            }),
    );

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <QueryClientProvider client={queryClient}>
                <HydrationBoundary state={pageProps.dehydratedState}>
                    <ReactQueryDevtools buttonPosition="bottom-left" />
                    <Component {...pageProps} />
                </HydrationBoundary>
            </QueryClientProvider>
        </>
    );
};

export default App;
