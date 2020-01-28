let npmCommand = process.env.npm_lifecycle_event;
process.env.CHROME_BIN  =  require('puppeteer').executablePath();

let browsers = ["ChromeHeadless"];
let reporters = ["mocha"];
let withCoverage = true;

if (npmCommand.includes(":watch")) {
    browsers = ["Chrome"];
    reporters.push("coverage-istanbul");
}

if (npmCommand.includes(":debug")) {
    browsers = ["Chrome"];
    withCoverage = false;
}

module.exports = function (config) {
    let webpackModuleRules = [
        {
            test: /\.ts$/,
            loader: "ts-loader",
            options: {
                configFile: "tsconfig-test.json"
            }
        }
    ];

    if (withCoverage) {
        webpackModuleRules.push({
            enforce: "post",
            test: /\.ts$/,
            loader: "istanbul-instrumenter-loader",
            include: /src/,
            exclude: /\.spec\.ts$/
        });
    }
    
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
                rules: webpackModuleRules
            }
        },
        reporters,
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