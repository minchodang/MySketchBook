import { basicUIPlugin } from '@stackflow/plugin-basic-ui';
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic';
import { stackflow } from '@stackflow/react';
import '@stackflow/plugin-basic-ui/index.css';
import SecondStack from '@/components/stack/SecondStack';
import MyFirstStack from '@/pages/stack-test';

export const { Stack, useFlow } = stackflow({
    transitionDuration: 350,
    activities: {
        MyFirstStack,
        SecondStack,
    },
    plugins: [
        basicRendererPlugin(),
        basicUIPlugin({
            theme: 'cupertino',
        }),
    ],
    initialActivity: () => 'MyFirstStack',
});
