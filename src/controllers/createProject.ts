import { Request, Response } from 'express';
import { createRepo } from '../services/createRepo';
import { createMetaData, generateKey, hashKey } from '../utils/hash';

export const handleCreateProject = async (req: Request, res: Response) => {
    let { repoName, projectData, theme } = req.body;
    if (!repoName || !theme) {
        repoName = (new Date()).toISOString();
        theme = 'default';
    }
    if (!projectData) {
        projectData = { 1: 'block', 2: 'block' }
    }
    const key = generateKey();
    const hashedKey = hashKey(key);
    const metadata = createMetaData(hashedKey, theme);

    try {
        await createRepo(repoName, projectData, metadata);
        res.json({ success: true, key: key });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong.' });
    }
};
