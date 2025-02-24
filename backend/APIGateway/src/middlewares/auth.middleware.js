import axios from "axios";

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];

    const response = await axios.get(
      "http://localhost:4000/auth-service/auth/check-user",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    req.user = response.data;

    if (req.method !== "GET") {
      req.body.userId = response.data._id;
    }

    next();
  } catch (error) {
    console.error(
      "error in authenticateUser || auth middleware",
      error.message
    );
    res.status(403).json({ message: "Forbidden" });
  }
};
