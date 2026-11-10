
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission."
      });
    }

    next();
  };
}

module.exports = authorizeRoles;
