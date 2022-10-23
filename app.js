import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import MongoDBSession from "connect-mongodb-session";
const MongoDBStore = MongoDBSession(session);
import * as dotenv from "dotenv";
dotenv.config();

import csrf from "csurf";
import flash from "connect-flash";
import fs from "fs";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import authRoutes from "./routes/auth.js";
// import { engine } from "express-handlebars";

import path from "path";
import rootDir from "./util/path.js";
import { get404, get500 } from "./controllers/error.js";

// import { mongoConnect } from "./util/database.js";
import mongoose from "mongoose";
import User from "./models/user.js";
import multer from "multer";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

// import sequelize from "./util/database.js";
// import { Product } from "./models/product.js";
// import { User } from "./models/user.js";
// import { Cart } from "./models/cart.js";
// import { CartItem } from "./models/cart-item.js";
// import { Order } from "./models/order.js";
// import { OrderItem } from "./models/order-item.js";
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.3mc22.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;
// const MONGODB_URI = process.env.MONGO_DATABASE;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

// app.engine(
//   "hbs",
//   engine({
//     layoutsDir: "views/layouts/",
//     defaultLayout: "main-layout",
//     extname: "hbs",
//   })
// );

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const accessLogStream = fs.createWriteStream(
  path.join(path.resolve(""), "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(express.static(path.join(rootDir, "public")));
app.use("/images", express.static(path.join(rootDir, "images")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  //"62b6f61870220a89dd2fb633"
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      // res.status(500).render("500", {
      //   pageTitle: "Error!",
      //   path: "/500",
      //   isAuthenticated: req.session.isLoggedIn,
      // });
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", get500);

app.use(get404);
app.use(get500);

// app.use((error, req, res, next) => {
//   // res.status(error.httpStatusCode).render(...);

//   res.status(500).render("500", {
//     pageTitle: "Error!",
//     path: "/500",
//     isAuthenticated: req.session.isLoggedIn,
//   });
// });

// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

// sequelize
//   //   .sync({ force: true })
//   .sync()
//   .then((result) => {
//     return User.findByPk(1);
//     // console.log(result);
//   })
//   .then((user) => {
//     if (!user) {
//       return User.create({ name: "Maneesh", email: "test@test.com" });
//     }
//     return user;
//   })
//   .then((user) => {
//     // console.log(user);
//     return user.createCart();
//   })
//   .then((cart) => {
//     app.listen(3000);
//   })
//   .catch((err) => console.log(err));

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT || 3000);
    console.log("listening");
  })
  .catch((err) => {
    console.log(err);
  });
