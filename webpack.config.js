const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const API_URL = {
  production: JSON.stringify(""),
  development: JSON.stringify("http://5.189.102.24")
};

// check environment mode
const environment =
  process.env.NODE_ENV === "production" ? "production" : "development";

module.exports = {
  entry: {
    main: "./src/site/entry.js",
    admin: "./src/admin/entry.js",
    login: "./src/login/entry.js"
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },

  resolve: {
    extensions: [".js", ".jsx", ".json"]
  },

  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },

  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              "react-hot-loader/babel",
              "babel-plugin-styled-components",
              "@babel/plugin-proposal-class-properties",
              [
                "import",
                { libraryName: "antd", libraryDirectory: "es", style: true }
              ]
            ]
          }
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "less-loader",
            options: {
              modifyVars: {
                "layout-header-height": "40px",
                "body-background": "#f5f5f5",
                "layout-body-background": "#f5f5f5",
                "layout-header-background": "#001529"
              },
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        loader: "webpack-ant-icon-loader",
        enforce: "pre",
        options: {
          chunkName: "antd-icons"
        },
        include: [require.resolve("@ant-design/icons/lib/dist")]
      }
    ]
  },

  devServer: {
    contentBase: "./dist",
    open: true,
    hot: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      chunks: ["main"]
    }),
    new HtmlWebpackPlugin({
      template: "./admin.html",
      filename: "admin.html",
      chunks: ["admin"]
    }),
    new HtmlWebpackPlugin({
      template: "./login.html",
      filename: "login.html",
      chunks: ["login"]
    }),
    new webpack.DefinePlugin({
      API_URL: API_URL[environment]
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    //new BundleAnalyzerPlugin()
  ]
};
