import { FC, PropsWithChildren, createContext } from 'react';
import useCalender from '@/hooks/useCalender';

const CalenderContext = createContext({});

const Calender: FC<PropsWithChildren> = ({ children }) => {
    const { ...props } = useCalender();
    return <CalenderContext.Provider value={props}>{children}</CalenderContext.Provider>;
};

export default Calender;
