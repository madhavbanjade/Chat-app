import jwt from "jsonwebtoken";

export const token = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: "1d",
  });
};
