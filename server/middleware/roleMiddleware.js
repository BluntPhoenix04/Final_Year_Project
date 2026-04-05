const allowFacultyOnly = (req, res, next) => {
  if (req.user.role !== "faculty") {
    return res.status(403).json({
      message: "Access denied. Faculty only."
    });
  }

  next();
};

module.exports = allowFacultyOnly;