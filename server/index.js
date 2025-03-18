import express from 'express'; 
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { auth } from 'express-oauth2-jwt-bearer';
import userRoute from './routes/userRoute.js';  // ✅ Default import
import residencyRoute from './routes/residencyRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Apply middleware before routes
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Server is running!");
});

// ✅ Define routes before `app.listen()`
app.use('/api/user', userRoute);
app.use("/api/residency", residencyRoute);

// ✅ Start server after setting up everything
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
