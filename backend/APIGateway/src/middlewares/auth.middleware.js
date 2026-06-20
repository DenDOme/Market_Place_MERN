import axios from "axios";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL + "/auth-service";

export const authenticateUser = async (req, res, next) => {
  const authCookie = req.headers.cookie;
  const authToken = req.headers.authorization?.split(" ")[1];
  try {
    if (!authCookie && !authToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/check-user`, {
      headers: { 
        cookie: authCookie || `jwt=${authToken}`
      },
    });

    req.user = response.data;
    req.body.userId = response.data._id;

    next();
  } catch (error) {
    console.error("Auth service error:", error.response?.status, error.response?.data);
    res.status(401).json({ message: "Unauthorized", error: error });
  }
};

export const checkUserRole = async (req, res, next) => {
  const authCookie = req.headers.cookie;
  const authToken = req.headers.authorization?.split(" ")[1];
  try {
    if (!authCookie && !authToken) return res.status(401).json({ message: "Unauthorized" });

    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/check-user`, {
      headers: { cookie: authCookie || `jwt=${authToken}` },
    });

    if (response.data.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = response.data;
    req.body.userId = response.data._id;

    next();
  } catch (error) {
    console.error("error in checkUserRole || auth middleware", error);
    res.status(403).json({ message: "Forbidden" });
  }
};
