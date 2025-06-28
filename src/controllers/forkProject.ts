import { Request, Response } from 'express';
import { forkRepo } from '../services/forkRepo';

export const handleForkProject = async (req: Request, res: Response) => {
    const { repoName } = req.body;

    if (!repoName) {
        res.status(400).json({ error: "Missing required fields" });
    }
    const newRepoName = `fork-${repoName}`;

    try {
        const { repoUrl, key, projectData } = await forkRepo(repoName, newRepoName);
        res.json({ success: true, repoUrl, key, projectData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not fork repository" });
    }
};
