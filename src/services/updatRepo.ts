import { Octokit } from "octokit";
import { getInstallationToken } from "./getToken"
import { config } from "../config/gitConfig";

export const updateProjectDataFile = async (repoName: string, newProjectData: Record<string, string>) => {
    const token = await getInstallationToken();
    const octokit = new Octokit({ auth: token });

    const { data: currentFile } = await octokit.request(
        'GET /repos/{owner}/{repo}/contents/projectData.json',
        {
            owner: config.org,
            repo: repoName,
        }
    );

    const sha = currentFile.sha; //sha is what github uses to identify the version of the specific file

    await octokit.request('PUT /repos/{owner}/{repo}/contents/projectData.json', {
        owner: config.org,
        repo: repoName,
        path: 'projectData.json',
        message: 'Updated projectData.json by student',
        sha,
        content: Buffer.from(JSON.stringify(newProjectData)).toString('base64'),
    });
};
