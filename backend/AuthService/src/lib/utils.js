import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  res.cookie("jwt", token, {
    maxAge: 7 * 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: "None",
    secure: false,
  });

  return token;
};
