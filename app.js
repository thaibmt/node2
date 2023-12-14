const config = require("config");
const express = require("express");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);
const bodyParser = require('body-parser');
const connectDB = require("./config/db");

const appController = require("./controllers/AppController");
const isAuth = require("./middleware/IsAuth");
const isAdmin = require("./middleware/IsAdmin");

const MONGO_DB_URI = config.get("MONGO_DB_URI");
const SERVER_PORT = config.get("SERVER_PORT");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
connectDB();

/**
 * @description: session store.
 */
const store = new mongodbStore({
  uri: MONGO_DB_URI,
  collection: "sessions",
});

/**
 * @description: disable etag header, to prevent 304 response code.
 */
app.disable("etag");

/**
 * @description: set view engine.
 */
app.set("view engine", "ejs");
app.use('/styles', express.static(__dirname + '/styles'));
app.use(express.urlencoded({ extended: false }));

/**
 * @description: session middleware.
 */
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

/**
 * @description: start server.
 */
app.listen(SERVER_PORT, () => {
  console.log(`Server is Running on: http://localhost:${SERVER_PORT}`);
});

/**
 * @description: Landing Page.
 */
app.get("/", appController.index_page);

/**
 * @description: Register Page.
 */
app.get("/register", appController.register_get);
app.post("/register", appController.register_post);

/**
 * @description: Login Page.
 */
app.get("/login", appController.login_get);
app.post("/login", appController.login_post);

/**
 * @description: Shoes.
 */
app.post("/shoess", isAdmin, appController.store_shoes);
app.get("/shoess/:id", isAuth, appController.view_shoes);
app.post("/shoess/update/:id", isAdmin, appController.update_shoes);
app.post("/shoess/delete/:id", isAdmin, appController.delete_shoes);

/**
 * @description: Dashboard Page.
 */
app.get("/dashboard", isAuth, appController.dashboard_get);

/**
 * @description: Logout Page.
 */
app.get("/logout", appController.logout_get);
