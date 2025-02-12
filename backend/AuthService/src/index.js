import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

import cors from 'cors';

import { connectDB } from "./lib/db.js";

import authRoutes from './routes/auth.route.js'

const PORT = process.env.PORT;
const __dirname = path.resolve();

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http:localhost:3000",
    credentials: true
}))

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})