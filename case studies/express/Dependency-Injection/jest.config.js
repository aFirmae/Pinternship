module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    globals: {
        "ts-jest": {
            tsconfig: {
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                strict: false,
            },
        },
    },
};
