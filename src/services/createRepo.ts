import { Octokit } from "octokit";
import { getInstallationToken } from "./getToken"
import { config } from "../config/gitConfig";

export const createRepo = async (repoName: string, projectData: object, metaData: object): Promise<string> => {
    const token = await getInstallationToken();
    const octokit = new Octokit({ auth: token });
    const description = 'Musicblocks project repository';

    //create repo
    const repo = await octokit.request(`POST /orgs/{org}/repos`, {
        org: config.org,
        name: repoName,
        description,
        private: false,
        has_issues: true,
        hash_projects: true,
        has_wiki: true,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    //writing files to repo
    const owner = config.org;
    const filesToCreate = [
        {
            path: 'README.md',
            content: `${repoName} is a musicblocks project`
        },
        {
            path: 'projectData.json',
            content: JSON.stringify(projectData, null)
        },
        {
            path: `metaData.json`,
            content: JSON.stringify(metaData, null)
        }
    ]

    await Promise.all(
        filesToCreate.map((file) =>
            octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                owner,
                repo: repoName,
                path: file.path,
                message: `Add ${file.path}`,
                content: Buffer.from(file.content).toString('base64'),
            })
        )
    );

    return repo.data.html_url;

}