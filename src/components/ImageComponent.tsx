import { useSuspenseQuery } from '@suspensive/react-query';
import router from 'next/router';
import QueryKeys from '../../next13-submodule/hooks/Querykey';
import {
    PicturesIndividualType,
    fetchPicture,
} from '../../next13-submodule/hooks/useGetPictureQuery';
import Image from 'next/image';
import { Suspense } from 'react';

interface ImageComponentProps {
    data: PicturesIndividualType;
}

export const ImageComponent = ({ data }: ImageComponentProps) => {
    return (
        <div key={data.id}>
            <h1>{data.description || data.alt_description}</h1>
            <Image
                src={data.urls.raw || ''}
                height={400}
                width={400}
                layout="responsive"
                placeholder="blur"
                alt={data.description}
                blurDataURL={data.urls.small}
            />
        </div>
    );
};
