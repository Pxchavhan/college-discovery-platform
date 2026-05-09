import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import collegeRoutes from './routes/collegeRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/colleges', collegeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'College Discovery API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
