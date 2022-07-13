// import { Sequelize } from "sequelize";

// const sequelize = new Sequelize("node-complete", "root", "maneesh", {
//   dialect: "mysql",
//   host: "localhost",
// });

// export default sequelize;

// import mongodb from "mongodb";
// const MongoClient = mongodb.MongoClient;

// let _db;

// export const mongoConnect = (callback) => {
//   MongoClient.connect(
//     `mongodb+srv://maneesh:maneesh@cluster0.3mc22.mongodb.net/shop?retryWrites=true&w=majority`
//   )
//     .then((client) => {
//       console.log("Connected");
//       _db = client.db();
//       callback();
//     })
//     .catch((err) => {
//       console.log(err);
//       throw err;
//     });
// };

// export const getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw "NO DATABASE FOUND!";
// };
