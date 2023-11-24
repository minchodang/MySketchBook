import { useEffect } from 'react';

const useMemoryTest = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/memory-usage', {
                    method: 'get',
                });
                const result = await response.json();
                console.log(JSON.stringify(result));
            } catch (e) {
                console.error(e);
            }
        };
        const intervalId = setInterval(() => {
            fetchData();
        }, 500);
        return () => clearInterval(intervalId);
    }, []);
};

export default useMemoryTest;
