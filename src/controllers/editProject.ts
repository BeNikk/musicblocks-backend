import { Request, Response } from 'express';
import { updateProjectDataFile } from '../services/updatRepo';

export const handleEditProject = async (req: Request, res: Response) => {
    const { repoName, projectData } = req.body;

    try {
        await updateProjectDataFile(repoName, projectData);
        res.status(200).json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
};
