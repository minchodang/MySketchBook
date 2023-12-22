import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import { useFlow } from '@/utils/stackflow';

const MyActivity: ActivityComponentType = () => {
    const { push } = useFlow();

    const onClick = () => {
        push(
            'Article',
            {
                title: 'Hello',
            },
            {
                animate: true,
            },
        );
    };

    return (
        <AppScreen>
            <div onClick={onClick}>My Activity</div>
            <button type="button">Go to article page</button>
        </AppScreen>
    );
};

export default MyActivity;
