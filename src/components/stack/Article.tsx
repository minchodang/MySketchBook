import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import { useFlow } from '@/utils/stackflow';

type ArticleParams = {
    title: string;
};
const Article: ActivityComponentType<ArticleParams> = ({ params }) => {
    const { pop } = useFlow();

    const onClickBack = () => {
        pop({
            animate: true,
        });
    };

    return (
        <AppScreen>
            <div onClick={onClickBack}>뒤로가기</div>
        </AppScreen>
    );
};

export default Article;
