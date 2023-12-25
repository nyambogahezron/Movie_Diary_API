import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorMiddleware.js';
import { notFound } from './errors/customErrors.js';
import connectDB from './config/db.js';
import userRoutes from './routes/authRoutes.js';
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/users', authRoutes);

//Serve frontend site
 app.get('/', (req, res) => {
    res.send('API is running....');
  });

app.use(notFound);
app.use(errorHandler);

//connect to MongoDB
//Start Application
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server started on port ${port}`));

  } catch (error) {
    console.log(error);
  }
};
start()