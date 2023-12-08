import Image from 'next/image';
import { PicturesIndividualType } from '../../lib/hooks/useGetPictureQuery';

interface ImageComponentProps {
    data: PicturesIndividualType;
}

export const ImageComponent = ({ data }: ImageComponentProps) => (
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
