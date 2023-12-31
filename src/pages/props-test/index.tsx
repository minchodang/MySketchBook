import { FC, memo, useEffect, useState } from 'react';
import styled from '@emotion/styled';

type Props = {
    counter: number;
};

type DeeperProps = {
    counter: {
        counter: number;
    };
};

const Button = styled.button``;

const Component: FC<Props> = memo((props) => {
    useEffect(() => {
        console.log('Component has been rendered!');
    });
    return <h1>{props.counter}</h1>;
});
Component.displayName = 'Component';

const DeeperComponent: FC<DeeperProps> = memo(
    (props) => {
        const { counter } = props.counter;
        useEffect(() => {
            console.log('DeeperComponent has been rendered!');
        });
        return <h1>{counter}</h1>;
    },
    // 재랜더링 및 중첩 객체 비교용 체크 함수.
    (prev, next) => next.counter.counter === prev.counter.counter,
);

DeeperComponent.displayName = 'DeeperComponent';

const IndexPage = () => {
    const [count, setCount] = useState<number>(0);
    const handleClick = () => {
        setCount((prev) => prev + 1);
    };
    return (
        <div>
            <Component counter={count} />
            <DeeperComponent counter={{ counter: count }} />
            <Button onClick={handleClick}>증가버튼</Button>
        </div>
    );
};

export default IndexPage;
