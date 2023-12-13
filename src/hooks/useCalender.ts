import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

const useCalender = () => {
    const [today, setToday] = useState(dayjs());
    const daysInMonth = today.daysInMonth();
    const firstDayOfMonth = dayjs(today).startOf('month').locale('ko');
    const dates = [];
    for (let i = 1; i <= daysInMonth; i += 1) {
        const date = dayjs(firstDayOfMonth).add(i - 1, 'day');
        dates.push(date);
    }
    return {
        today,
        daysInMonth,
        firstDayOfMonth,
        dates,
    };
};

export default useCalender;
