const mongoose = require("mongoose");

async function connectToDB() {
  mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("successfully connected to DB")
}).catch((error)=>{
      console.log("There is error in connected to DB" , error)
  });
}

module.exports = connectToDB
