module.exports = (req, res, next) => {
  if (req.session.isAuth) {
    return next();
  } else {
    req.session.error = "Vui lòng đăng nhập.";
    res.redirect("/login");
  }
};
