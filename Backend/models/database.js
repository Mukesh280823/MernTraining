// // for cmd commect compass and shell =>      "C:\Program Files\MongoDB\mongosh-1.10.6-win32-x64\bin\mongosh"
// //  to show database table ->  show dbs
// // create a db -> use databaseName 

// // require mongoose module 
// const mongoose = require('mongoose');

// // connect mongoose with MongoDB
// mongoose.connect('mongodb://localhost:27017/Mern_Portal', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log("MongoDB Connected"))
//     .catch((err) => console.log("Mongo Error", err));

// module.exports = mongoose; // Use `module.exports`, not `module.export`
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Mern_Portal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });