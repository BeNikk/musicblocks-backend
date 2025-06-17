import { config } from "../config/gitConfig";
import { getAuthenticatedOctokit } from "../utils/octokit";

export const getOpenPullRequestsWithProjectData = async (repoName: string) => {
    const octokit = await getAuthenticatedOctokit();
    const org = config.org;

    const { data: pullRequests } = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
        owner: org,
        repo: repoName,
        state: 'open',
    });

    const results = await Promise.all(
        pullRequests.map(async (pr: { head: { ref: unknown; }; }) => {
            let projectData = null;
            try {
                const { data: file } = await octokit.request(
                    'GET /repos/{owner}/{repo}/contents/{path}',
                    {
                        owner: org,
                        repo: repoName,
                        path: 'projectData.json',
                        ref: pr.head.ref,
                    }
                );
                projectData = JSON.parse(Buffer.from(file.content, 'base64').toString('utf-8'));
            } catch (err) {
                projectData = null;
                console.log(err);
            }
            return {
                pr,
                projectData,
            };
        })
    );

    return results;
};