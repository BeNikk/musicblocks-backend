import { Request, Response } from "express";
import { getProjectDataAtCommit } from "../services/getProjectDataAtCommit";

export const handleGetProjectDataWithCommit = async(req:Request,res:Response) => {
    try{
        const {repoName, sha} = req.body;
        const result = await getProjectDataAtCommit(repoName,sha);
        res.status(200).json(result.projectData);

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal error"});
        
    }
}