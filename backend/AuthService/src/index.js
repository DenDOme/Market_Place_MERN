import app from "./middleware/app.js";
import { connectDB } from "./lib/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});