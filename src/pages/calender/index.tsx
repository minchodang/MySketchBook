import styled from '@emotion/styled';
import useCalender from '@/hooks/useCalender';

const weeks = ['월', '화', '수', '목', '금', '토', '일'];

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const CalenderContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    border: 1px solid black;
    box-sizing: border-box;
    padding: 10px;
    max-width: 1000px;
    min-width: 600px;
    max-height: 1000px;
    min-height: 1000px;
`;

const DateHeaed = styled.div`
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
    const { dates, daysInMonth, firstDayOfMonth, today } = useCalender();

    const emptyDays = new Array(firstDayOfMonth.day()).fill(null);

    return (
        <Container>
            <div>
                <h1>{today.format('YYYY-MM-DD')}</h1>
                <h1>{today.format('MMMM')}</h1>
                <h3>{daysInMonth}일</h3>
            </div>
            <CalenderContainer>
                {weeks.map((value) => (
                    <DateHeaed>{value}</DateHeaed>
                ))}

                {emptyDays.concat(dates).map((date, index) => (
                    <DateDiv key={date}>{date ? date.format('DD') : ''}</DateDiv>
                ))}
            </CalenderContainer>
        </Container>
    );
};

export default CalenderPage;
