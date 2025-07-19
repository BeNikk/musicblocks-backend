import { config } from "../config/gitConfig";
import { getAuthenticatedOctokit } from "../utils/octokit";

export const getProjectData = async (repoName: string) => {
  try {
    const octokit = await getAuthenticatedOctokit();
    const response  = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: config.org,
      repo: repoName,
      path: "projectData.json",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    const content = Buffer.from(response.data.content, "base64").toString();
    return {
      success: true,
      projectData: JSON.parse(content),
    };
  } catch (err) {
    return err;
  }
};
