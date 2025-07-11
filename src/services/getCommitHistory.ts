import { config } from "../config/gitConfig";
import { getAuthenticatedOctokit } from "../utils/octokit";

export const getCommitHistory = async (repoName: string) => {
  try {
    const octokit = await getAuthenticatedOctokit();
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner: config.org,
        repo: repoName,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
