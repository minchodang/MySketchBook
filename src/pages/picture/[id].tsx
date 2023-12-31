import styled from '@emotion/styled';
import { QueryClient, dehydrate, useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';
import QueryKeys from '../../../lib/hooks/Querykey';
import { fetchPicture, useGetPictureQuery } from '../../../lib/hooks/useGetPictureQuery';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const DetailPage = () => {
    const router = useRouter();
    const { id } = router.query as { id: string };
    const { data } = useGetPictureQuery({ id });

    return (
        <Container>
            {data ? (
                <div key={data?.id}>
                    <h1>{data?.description || data?.alt_description}</h1>
                    <Image
                        src={data?.urls.raw || ''}
                        height={400}
                        width={400}
                        alt={data?.description}
                        style={{
                            objectFit: 'cover',
                        }}
                    />
                </div>
            ) : null}
        </Container>
    );
};

export async function getServerSideProps(context: { query: { id: string } }) {
    const { id } = context.query;

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: [QueryKeys.picture],
        queryFn: () => fetchPicture({ id }),
    });

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
}

export default DetailPage;
