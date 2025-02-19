import { NextApiRequest, NextApiResponse } from 'next';

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.json('ok');
};

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        await POST(req, res);
    }
};

export default handler;
