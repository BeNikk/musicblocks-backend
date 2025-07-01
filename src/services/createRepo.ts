import { config } from "../config/gitConfig";
import { getAuthenticatedOctokit } from "../utils/octokit";
import { v4 as uuidv4 } from "uuid";


export const createRepo = async (repoName: string, projectData: object, metaData: object): Promise<string> => {
    const octokit = await getAuthenticatedOctokit();
    const description = 'Musicblocks project repository';
    const uniqueRepoName = `${repoName}-${uuidv4()}`;

    //create repo
    const repo = await octokit.request(`POST /orgs/{org}/repos`, {
        org: config.org,
        name: uniqueRepoName,
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
                repo: uniqueRepoName,
                path: file.path,
                message: `Add ${file.path}`,
                content: Buffer.from(file.content).toString('base64'),
            })
        )
    );

    return repo.data.html_url;

}