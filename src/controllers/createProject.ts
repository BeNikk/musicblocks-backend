import { Request, Response } from 'express';
import { createRepo } from '../services/createRepo';
import { createMetaData, generateKey, hashKey } from '../utils/hash';

export const handleCreateProject = async (req: Request, res: Response) => {
    let { repoName, theme, description } = req.body;
    const { projectData } = req.body;
    if (!repoName || !theme) {
        repoName = (new Date()).toISOString();
        theme = 'default';
    }
    if(!description){
        description = "Musicblocks project";
    }
    if (!projectData) {
        res.status(400).json({message:"No project data"});
    }
    const key = generateKey();
    const hashedKey = hashKey(key);
    const metadata = createMetaData(hashedKey, theme);

    try {
        await createRepo(repoName, projectData, metadata, description);
        res.json({ success: true, key: key });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong.' });
    }
};
