import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}, Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('Make sure your IP address is whitelisted in MongoDB Atlas');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export { connectDB };
