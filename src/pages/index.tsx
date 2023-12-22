import styled from '@emotion/styled';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';
import QueryKeys from '../../lib/hooks/Querykey';
import { fetchPictures, useGetPicturesQuery } from '../../lib/hooks/useGetPicturesQuery';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const IndexPage = () => {
    const { data } = useGetPicturesQuery({ page: 1, limit: 2 });
    const router = useRouter();
    return (
        <Container>
            {(data || []).map((value) => (
                <div
                    key={value.id}
                    onClick={() => {
                        router.push(`/picture/${value.id}`);
                    }}
                >
                    <h1>{value.description || value.alt_description}</h1>
                    <Image
                        src={value.urls.regular}
                        height={400}
                        width={400}
                        alt={value.description}
                        style={{
                            objectFit: 'cover',
                        }}
                    />
                </div>
            ))}
        </Container>
    );
};

export async function getServerSideProps() {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: [QueryKeys.pictures],
        queryFn: () => fetchPictures({ page: 1, limit: 2 }),
    });

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
}

export default IndexPage;
