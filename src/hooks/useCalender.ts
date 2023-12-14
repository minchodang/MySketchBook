import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

const getKoreanWeekdays = () =>
    Array.from({ length: 7 }, (_, index) => {
        const day = dayjs().day(index + 1);
        return day.format('ddd');
    });

const useCalender = () => {
    const [today, setToday] = useState(dayjs().startOf('month'));
    const daysInMonth = today.daysInMonth();
    const firstDayOfMonth = today.day();
    const restDays = Array.from({ length: daysInMonth }, (_, index) =>
        dayjs(today).add(index, 'day'),
    );
    const emptyDays = new Array(firstDayOfMonth).fill(null);
    const weeks = getKoreanWeekdays();

    const changeMonth = (direction?: string) => {
        switch (direction) {
            case 'prev':
                setToday(dayjs(today).subtract(1, 'month').startOf('month'));
                break;
            case 'next':
                setToday(dayjs(today).add(1, 'month').startOf('month'));
                break;
            default:
                setToday(dayjs().startOf('month'));
                break;
        }
    };

    const dates = [...emptyDays, ...restDays];

    return {
        today,
        weeks,
        daysInMonth,
        firstDayOfMonth,
        dates,
        emptyDays,
        changeMonth,
    };
};

export default useCalender;
