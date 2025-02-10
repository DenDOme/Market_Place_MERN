import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import cors from 'cors';

import { connectDB } from "./lib/db.js";

import productRoutes from './routes/product.route.js';
import categoryRoutes from './routes/category.route.js';
import favouriteRoutes from './routes/favourite.route.js';
import reviewRoutes from './routes/review.route.js';
import userActionRoutes from './routes/userAction.route.js';

const PORT = process.env.PORT;
const __dirname = path.resolve();

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({
    origin: "http:localhost:3000",
    credentials: true
}));

app.use("api/product", productRoutes);
app.use("api/category", categoryRoutes);
app.use("api/favourite", favouriteRoutes);
app.use("api/review", reviewRoutes);
app.use("api/user-action", userActionRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})