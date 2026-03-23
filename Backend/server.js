const app = require("./src/app");
const connectToDB = require("./src/config/dataBase.config");
const port = 5000;

connectToDB();

app.listen(port, () => {
  console.log("server is running");
});
