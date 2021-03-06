module.exports = {
    presets: [
        "next/babel"
    ],
    env: {
        test: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            node: 'current',
                        },
                    },
                ],
                '@babel/preset-typescript',
            ],
            plugins: [
                '@babel/plugin-proposal-optional-chaining',
            ],
        }
    }
};
