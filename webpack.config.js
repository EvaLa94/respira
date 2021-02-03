const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: ["./src/view.js", "./src/service.js", "./src/map.js"],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new Dotenv({
      systemvars: true,
    }),
  ],
};
