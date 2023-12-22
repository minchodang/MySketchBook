import { basicUIPlugin } from '@stackflow/plugin-basic-ui';
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic';
import { stackflow } from '@stackflow/react';
import Article from '@/components/stack/Article';
import MyActivity from '@/components/stack/MyAcitivity';

export const { Stack, useFlow } = stackflow({
    transitionDuration: 350,
    activities: {
        MyActivity,
        Article,
    },
    plugins: [
        basicRendererPlugin(),
        basicUIPlugin({
            theme: 'cupertino',
            // theme: 'android',
        }),
    ],
    initialActivity: () => 'MyActivity',
});
