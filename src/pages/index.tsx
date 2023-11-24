import styled from '@emotion/styled';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
    fetchPictures,
    useGetPicturesQuery,
} from '../../next13-submodule/hooks/useGetPicturesQuery';
import QueryKeys from '../../next13-submodule/hooks/Querykey';

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
                        layout="responsive"
                        placeholder="blur"
                        alt={value.description}
                        blurDataURL={value.urls.regular}
                    />
                </div>
            ))}
        </Container>
    );
};

export async function getServerSideProps() {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery([QueryKeys.pictures], () => {
        fetchPictures({ page: 1, limit: 2 });
    });

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
}

export default IndexPage;
