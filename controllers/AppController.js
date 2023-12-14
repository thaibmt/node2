const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Shoes = require("../models/Shoes");

/**
 * @description: Landing Page.
 */
exports.index_page = (req, res) => {
  res.render("index");
};

/**
 * @description: Register Page.
 */
exports.register_get = (req, res) => {
  // get the error message from session and pass to the view.
  const error = req.session.error;

  // delete the error message after rendering the page.
  delete req.session.error;

  // render the page with error message.
  res.render("register", { error: error });
};

exports.register_post = async (req, res) => {
  const { username, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    req.session.error = "Người dùng đã tồn tại.";
    return res.redirect("/register");
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({
    username,
    email,
    password: hashedPassword,
    role: 'user'
  });

  await user.save();

  res.redirect("/login");
};

/**
 * @description: Shoes Page.
 */
exports.view_shoes = async (req, res) => {
  const id = req.params.id;
  const shoes = await Shoes.findOne({ _id: id });
  res.render("view", { shoes: shoes });
};
exports.delete_shoes = async (req, res) => {
  const id = req.params.id;
  try {
    await Shoes.deleteOne({ _id: id });
    req.session.success = true
  } catch (err) {
    req.session.error = true
  }
  res.redirect("/dashboard");
};
exports.store_shoes = async (req, res) => {
  const { title, price, description } = req.body;
  let shoes = new Shoes({
    title,
    price,
    description
  });
  try {
    await shoes.save();
    req.session.success = true
  } catch (err) {
    req.session.error = true
  }
  res.redirect("/dashboard");
};
exports.update_shoes = async (req, res) => {
  const { title, price, description } = req.body;
  const id = req.params.id;
  try {
    await Shoes.updateOne({ _id: id }, { title, price, description });
    req.session.success = true
  } catch (err) {
    req.session.error = true
  }
  res.redirect("/dashboard");
};

/**
 * @description: Login Page.
 */
exports.login_get = (req, res) => {
  // get the error message from session and pass to the view.
  const error = req.session.error;

  // delete the error message after rendering the page.
  delete req.session.error;
  // check login
  if (req.session.isAuth) {
    return res.redirect("/dashboard")
  }
  // render the page with error message.
  res.render("login", { error: error });
};

exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    req.session.error = "Thông tin đăng nhập không đúng.";

    return res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    req.session.error = "Thông tin đăng nhập không đúng.";

    return res.redirect("/login");
  }

  req.session.isAuth = true;
  req.session.username = user.username;
  req.session.email = user.email;
  req.session.role = user.role;
  res.redirect("/dashboard");
};

/**
 * @description: Dashboard Page.
 */
exports.dashboard_get = async (req, res) => {
  const username = req.session.username;
  const role = req.session.role;
  const error = req.session.error;
  const success = req.session.success;
  const shoess = await Shoes.find({});
  delete req.session.error;
  delete req.session.success;
  if (!req.session.isAuth) {
    return res.redirect("/login");
  }

  res.render("dashboard", { shoess: shoess, username: username, role: role, error: error, success: success });
};

/**
 * @description: Logout Page.
 */
exports.logout_get = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      throw error;
    }

    res.redirect("/");
  });
};
