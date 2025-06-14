import express from 'express';
import { handleCreateProject } from '../controllers/createProject';
import { verifyOwner } from '../middleware/verifyOwner';
import { handleEditProject } from '../controllers/editProject';
import { handleForkProject } from '../controllers/forkProject';

const projectRouter = express.Router();

projectRouter.post('/create', handleCreateProject);
projectRouter.post('/fork', handleForkProject);
projectRouter.put('/edit', verifyOwner, handleEditProject);

export default projectRouter;
