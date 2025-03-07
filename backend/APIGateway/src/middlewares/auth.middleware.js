import axios from "axios";

export const authenticateUser = async (req, res, next) => {
  const authCookie = req.headers.cookie;
  try {
    if (!authCookie) return res.status(401).json({ message: "Unauthorized" });

    const response = await axios.get(
      "http://auth-service:4000/auth-service/auth/check-user",
      {
        headers: { cookie: authCookie },
      }
    );

    req.user = response.data;
    req.body.userId = response.data._id;

    next();
  } catch (error) {
    console.error(
      "error in authenticateUser || auth middleware",
      error.message
    );
    res.status(403).json({ message: "Forbidden" });
  }
};
