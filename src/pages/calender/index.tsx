import styled from '@emotion/styled';
import useCalender from '@/hooks/useCalender';

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const CalenderTitle = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
`;

const CalenderContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    border: 1px solid black;
    box-sizing: border-box;
    padding: 10px;
    width: calc(100vw - 15px);
`;

const DateHead = styled.div`
    background-color: lightsalmon;
    text-align: center;
    color: white;
    font-weight: 900;
    height: 40px;
    line-height: 40px;
    min-height: 30px;
    height: 50px;
`;

const DateDiv = styled.div`
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
`;
const CalenderPage = () => {
    const { dates, today, changeMonth, weeks } = useCalender();

    return (
        <Container>
            <CalenderTitle>
                <button
                    type="button"
                    onClick={() => {
                        changeMonth('prev');
                    }}
                >
                    {'<'}
                </button>
                <h1>{today.format('MMMM')}</h1>
                <button
                    type="button"
                    onClick={() => {
                        changeMonth('next');
                    }}
                >
                    {'>'}
                </button>
            </CalenderTitle>
            <CalenderContainer>
                {weeks.map((value) => (
                    <DateHead key={value}>{value}</DateHead>
                ))}

                {dates.map((date, index) => (
                    <DateDiv key={date ? date.toISOString() : `empty-${index}`}>
                        {date ? date.format('DD') : ''}
                    </DateDiv>
                ))}
            </CalenderContainer>
        </Container>
    );
};

export default CalenderPage;
