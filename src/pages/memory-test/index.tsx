import { memoryLeakFunction } from '@/hooks/memoryLeakFunction';
import useMemoryTest from '@/hooks/useMemoryTest';
import axios from 'axios';
import { useEffect } from 'react';

const IndexPage = () => {
    useMemoryTest();

    return <div>메모리 페이지</div>;
};

export default IndexPage;
