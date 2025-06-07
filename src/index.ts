import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import projectRouter from './routes/projectRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/github', projectRouter);

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
