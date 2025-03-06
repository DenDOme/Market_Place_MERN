import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const ALL_SERVICES = {
  auth: process.env.AUTH_SERVICE_URL + "/auth-service",
  // product sub routes
  product: process.env.PRODUCT_SERVICE_URL + "/product-service",
  category: process.env.PRODUCT_SERVICE_URL + "/product-service",
  review: process.env.PRODUCT_SERVICE_URL + "/product-service",
  favourite: process.env.PRODUCT_SERVICE_URL + "/product-service",
  "user-action": process.env.PRODUCT_SERVICE_URL + "/product-service",
  // order sub routes
  order: process.env.ORDER_SERVICE_URL + "/order-service",
  cart: process.env.ORDER_SERVICE_URL + "/order-service",
};

const redirectMiddleware = async (req, res, next) => {
  try {
    const fullUrl = req.originalUrl;
    const extractedPath = fullUrl.replace("/api/", "");

    const [serviceKey, ...remainingPath] = extractedPath.split("/");

    const serviceUrl = ALL_SERVICES[serviceKey];

    if (!serviceUrl) {
      return res.status(400).json({ error: "Unknown service" });
    }

    const finalUrl = `${serviceUrl}/${serviceKey}/${remainingPath.join("/")}`;

    const response = await axios({
      method: req.method,
      url: finalUrl,
      data: req.body,
      timeout: 100000,
      withCredentials: true,
    });

    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error in redirectMiddleware:", error);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default redirectMiddleware;
