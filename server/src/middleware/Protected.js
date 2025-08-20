import jwt from "jsonwebtoken";
export const Protected = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "unAuthoriaed: Token missing",
      });
    }
    const token = authHeader.split(" ")[1]; // get token after bearer
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded.userId;
    next();
  } catch (error) {
    console.log("err", error);

    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
