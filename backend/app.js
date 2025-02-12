import express from "express";
import cors from "cors";
import { connectDB } from "./DB/Database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";

dotenv.config();

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Allowed Frontend Domains
const allowedOrigins = [
  "http://localhost:3000",
  "https://project11-10.onrender.com",  // ✅ Backend
  "https://project11-ywod.vercel.app",  // ✅ Frontend
  "https://project11-ywod-git-main-devanshus-projects-9b36d403.vercel.app",
  /^https:\/\/project11-ywod.*\.vercel\.app$/  // ✅ Allow any Vercel preview
];

// ✅ CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);  // Allow non-browser requests
    
    if (allowedOrigins.includes(origin) || allowedOrigins.some(pattern => pattern instanceof RegExp && pattern.test(origin))) {
      return callback(null, true);
    }

    console.log("🚫 Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200
}));

// ✅ Additional Security Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (allowedOrigins.includes(req.headers.origin) || allowedOrigins.some(pattern => pattern instanceof RegExp && pattern.test(req.headers.origin))) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});

// ✅ Security Middlewares
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ API Routes
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Hello World! Backend is running.");
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on https://project11-10.onrender.com`);
});
