const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

module.exports = {
    entry: {
       tabContent: "./src/tabContent.tsx",
    },

    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            "azure-devops-extension-sdk": path.resolve("node_modules/azure-devops-extension-sdk")
        },
    },
    stats: {
        warnings: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "azure-devops-ui/buildScripts/css-variables-loader", { loader: "sass-loader", options: { api: "modern", sassOptions: { loadPaths: [__dirname], silenceDeprecations: ["import"] } } }]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.woff$/,
                type: 'asset/inline'
            },
            {
                test: /\.html$/,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "*.html", context: path.resolve(__dirname, "src") }
            ]
        }),
        new webpack.SourceMapDevToolPlugin({})
    ]
};
