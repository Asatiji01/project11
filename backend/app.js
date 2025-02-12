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

// Connect to MongoDB
connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8000",
  "https://main.d1sj7cd70hlter.amplifyapp.com",
  "https://expense-tracker-app-three-beryl.vercel.app",
  "https://expense-tracker-app-knl1.onrender.com",
  "https://expenstrackkerr.vercel.app",
  "https://expenstrackkerr-qerlln72k-devanshus-projects-9b36d403.vercel.app",
  /^https:\/\/expenstrackkerr.*\.vercel\.app$/,
  "https://project11-ywod.vercel.app",
  "https://project11-ywod-git-main-devanshus-projects-9b36d403.vercel.app",
  "https://project11-ywod-n3dje3d1r-devanshus-projects-9b36d403.vercel.app"
];

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || allowedOrigins.some(pattern => pattern instanceof RegExp && pattern.test(origin))) {
      return callback(null, true);
    }
    
    console.log("🚫 Blocked by CORS:", origin);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Access-Control-Allow-Origin"],
  optionsSuccessStatus: 200
}));

// ✅ Handle preflight requests (OPTIONS) globally
app.options("*", cors());

// ✅ Force CORS headers in all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin) || allowedOrigins.some(pattern => pattern instanceof RegExp && pattern.test(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Security & Logging Middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API Routes
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy!" });
});

// Error Handling Middleware
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
