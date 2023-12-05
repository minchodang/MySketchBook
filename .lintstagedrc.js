module.exports = {
    '**/*.(ts|tsx)': () => 'npx tsc --noEmit',

    '**/*.(ts|tsx)': (filenames) => {
        return [
            `npx eslint --fix ${filenames.join(' ')}`,
            `npx prettier --write ${filenames.join(' ')}`,
            `npx stylelint --ignore-path .gitignore ${filenames.join(' ')}`,
        ];
    },
};
