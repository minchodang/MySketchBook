let listItems: number[] = [];
export class MemoryLeakFunction {
    exec() {
        for (let i = 0; i < 1_000_000; ++i) {
            listItems.push(i);
        }
    }
    [Symbol.dispose]() {
        listItems = [];
        console.log('클린업!');
    }
}

export default async function handler(
    req: { method: string },
    res: {
        status: (arg0: number) => {
            json: {
                (arg0: { heapUsedMB?: number; externalMB?: number; message?: string }): void;
            };
        };
    },
) {
    if (req.method === 'GET') {
        const func = new MemoryLeakFunction();
        try {
            func.exec();
            const memoryUsage = process.memoryUsage();
            res.status(200).json({
                heapUsedMB: memoryUsage.heapUsed / 1024 / 1024,
                externalMB: memoryUsage.external / 1024 / 1024,
            });
        } finally {
            func[Symbol.dispose]();
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
