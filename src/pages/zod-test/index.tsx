import { useQuery } from '@tanstack/react-query';
import { getZodData } from '../../../lib/api/getZodData';

const ZodTestPage = () => {
    const { data } = useQuery({
        queryKey: ['zod-test'],
        queryFn: getZodData,
    });

    return (
        <div>
            <div>{data?.item}</div>
            <div>{data?.test.item1}</div>
        </div>
    );
};

export default ZodTestPage;
