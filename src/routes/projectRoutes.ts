import express from 'express';
import { handleCreateProject } from '../controllers/createProject';

const projectRouter = express.Router();

projectRouter.post('/create', handleCreateProject);

export default projectRouter;
