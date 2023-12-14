module.exports = (req, res, next) => {
  if (req.session.role === 'admin') {
    return next();
  } else {
    req.session.error = "Không phải là admin.";
    res.redirect("back");
  }
};
