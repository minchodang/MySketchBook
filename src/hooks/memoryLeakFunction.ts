const listItems = [];

export const memoryLeakFunction = () => {
    for (let i = 0; i < 1_000_000; ++i) {
        listItems.push(i);
    }
    console.log(`${process.memoryUsage().heapUsed / 1024 / 1024} MB`);
};
