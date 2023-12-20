import { useState } from 'react';
import {
    DehydratedState,
    HydrationBoundary,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Stack } from '@/utils/stackflow';

const App = ({ Component, pageProps }: AppProps<{ dehydratedState: DehydratedState }>) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <QueryClientProvider client={queryClient}>
                <HydrationBoundary state={pageProps.dehydratedState}>
                    <Stack />
                    {/* <Component {...pageProps} /> */}
                </HydrationBoundary>
            </QueryClientProvider>
        </>
    );
};

export default App;
