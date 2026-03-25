const app = require("./src/app");
const connectToDB = require("./src/config/dataBase.config");
const PORT = process.env.PORT || 5000; // 👈 FIX


connectToDB();

app.listen(PORT, () => {
  console.log("server is running");
});
