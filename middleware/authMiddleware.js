const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.flash('error_msg', 'Please login to access admin area');
    return res.redirect('/admin/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    res.clearCookie('token');
    req.flash('error_msg', 'Session expired. Please login again');
    return res.redirect('/admin/login');
  }
};

const redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.redirect('/admin/dashboard');
    } catch {
      res.clearCookie('token');
    }
  }
  next();
};

module.exports = { protect, redirectIfAuthenticated };
