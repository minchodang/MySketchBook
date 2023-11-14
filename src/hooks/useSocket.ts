import { useEffect, useRef } from 'react';

const useSocket = () => {
    const socketCreated = useRef(false);

    useEffect(() => {
        const initializeSocket = async () => {
            if (!socketCreated.current) {
                try {
                    await fetch('/api/socket').then(() => {
                        socketCreated.current = true;
                    });
                } catch (error) {
                    console.error('Error initializing socket:', error);
                }
            }
        };

        initializeSocket();
    }, []);
};

export default useSocket;
