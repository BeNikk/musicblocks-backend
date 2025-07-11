import { Request, Response } from "express";
import { getCommitHistory } from "../services/getCommitHistory";

export const handleGetCommits = async (req: Request, res: Response) => {
  try {
    const { repoName } = req.body;
    const response = await getCommitHistory(repoName);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
