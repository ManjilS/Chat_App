import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const{ MONGO_URI } = process.env;
    if (!MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    const conn =await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected successfully :', conn.connection.host);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};