import express from 'express';
import { handleCreateProject } from '../controllers/createProject';
import { verifyOwner } from '../middleware/verifyOwner';
import { handleEditProject } from '../controllers/editProject';
import { handleForkProject } from '../controllers/forkProject';
import { handleCreatePR } from '../controllers/pullRequest';
import { handleGetOpenPullRequests } from '../controllers/getPullRequest';
import { handleForkWithHistory } from '../controllers/forkWithHistory';

const projectRouter = express.Router();

projectRouter.post('/create', handleCreateProject);
projectRouter.post('/fork', handleForkProject);
projectRouter.post('/forkHistory',handleForkWithHistory);
projectRouter.put('/edit', verifyOwner, handleEditProject);
projectRouter.post('/create-pr', handleCreatePR);
projectRouter.get('/openPR',handleGetOpenPullRequests);

export default projectRouter;
