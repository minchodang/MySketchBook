import useMemoryTest from '@/hooks/useMemoryTest';

const IndexPage = () => {
    useMemoryTest();

    return <div>메모리 페이지</div>;
};

export default IndexPage;
