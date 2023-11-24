import styled from '@emotion/styled';
import { FC, useState } from 'react';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const WaterSection = styled.section`
    display: flex;
    justify-content: center;
    align-self: center;
    width: 100%;
    margin-top: 100px;
`;

const WaterContainer = styled.div<{ height?: number }>`
    width: 200px;
    height: 200px;
    background-color: #80c5dc;
    border-radius: 0 0 40px 40px;
    box-shadow: inset 0 0 50px #1c637c;
    position: relative;
    overflow: hidden;
    transition: background-color 0.3s;

    &::before {
        content: ' ';
        position: absolute;
        width: 200%;
        height: ${({ height }) => (height ? `${200 + height}%` : '200%')};
        border-radius: 41%;
        top: -150%;
        left: -50%;
        background-color: #ececec;
        animation: wave 12s infinite linear;
    }

    &::after {
        content: ' ';
        position: absolute;
        width: 204%;
        height: ${({ height }) => (height ? `${200 + height}%` : '204%')};
        border-radius: 41%;
        top: -150%;
        left: -52%;
        background-color: #ececec80;
        animation: wave 12s infinite linear;
        animation-delay: 0.5s;
    }

    @keyframes wave {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    margin-top: 50px;
    gap: 30px;

    button {
        width: 35px;
        height: 35px;
        cursor: pointer;
        font-size: 18px;
        border: none;
        background-color: #4caf50;
        color: #fff;
        border-radius: 50%;
        transition: background-color 0.3s, transform 0.3s;

        &:hover {
            background-color: #45a049;
        }

        &:active {
            transform: scale(0.9);
        }
    }
`;

const WaterRecordPage: FC = () => {
    const [height, setHeight] = useState<number>(0);

    const increaseHeight = () => {
        setHeight((prevHeight) => Math.min(prevHeight - 25, 30));
    };

    const decreaseHeight = () => {
        setHeight((prevHeight) => Math.max(prevHeight + 25, 0));
    };

    return (
        <Container>
            <div>물 기록</div>
            <WaterSection>
                <WaterContainer height={height} />
            </WaterSection>
            <ButtonContainer>
                <button onClick={increaseHeight}>+</button>
                <button onClick={decreaseHeight}>-</button>
            </ButtonContainer>
        </Container>
    );
};

export default WaterRecordPage;
