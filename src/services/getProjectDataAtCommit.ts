import { config } from "../config/gitConfig";
import { getAuthenticatedOctokit } from "../utils/octokit";

export const getProjectDataAtCommit = async (
  repoName: string,
  commitSha: string
) => {
  try {
    const octokit = await getAuthenticatedOctokit();
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: config.org,
        repo: repoName,
        path: "projectData.json",
        ref: commitSha,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const content = Buffer.from(response.data.content, "base64").toString();
    return {
      success: true,
      projectData: JSON.parse(content),
      sha: commitSha,
    };
  } catch (error) {
    console.error("Error fetching projectData.json at commit:", error);
    return {
      success: false,
      message: "Failed to fetch file at commit",
      error,
    };
  }
};
