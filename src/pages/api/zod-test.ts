import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({
        id: '1',
        item: '테스트용',
        test: '2324',
    });
};

export default handler;
