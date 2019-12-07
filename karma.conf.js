let npmCommand = process.env.npm_lifecycle_event;

let browsers = ["ChromeHeadless", "Chromium"];

if (npmCommand.includes(":watch")) {
    browsers = ["Chrome", "Chromium"];
}

module.exports = function (config) {
    config.set({
        frameworks: ["jasmine"],
        browsers: browsers,
        port: 6400,
        files: ["./test/entry.ts"],
        preprocessors: {
            "./test/entry.ts": ["webpack"],
        },
        webpack: {
            devtool: "inline-source-map",
            mode: "development",
            resolve: {
                extensions: [".ts", ".tsx", ".js"]
            },
            module: {
                rules: [
                    {
                        test: /\.ts$/,
                        loader: "ts-loader",
                        options: {
                            configFile: "tsconfig-test.json"
                        }
                    },
                    {
                        enforce: "post",
                        test: /\.ts$/,
                        loader: "istanbul-instrumenter-loader",
                        include: /src/,
                        exclude: /\.spec\.ts$/
                    }
                ]
            }
        },
        reporters: ["mocha", "coverage-istanbul"],
        mochaReporter: {
            ignoreSkipped: true
        },
        coverageIstanbulReporter: {
            reports: ["text-summary", "html"]
        },
        webpackMiddleware: {
            noInfo: true
        },
        mime: {
            // so chrome doesn"t refuse execution
            "text/x-typescript": ["ts", "tsx"]
        }
    });
}