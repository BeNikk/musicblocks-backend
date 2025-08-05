import { config } from "../config/gitConfig";
import { getAuthenticatedOctokit } from "../utils/octokit";
import { v4 as uuidv4 } from "uuid";

export const createRepo = async (
  repoName: string,
  projectData: object,
  metaData: object,
  description: string,
  theme: string
): Promise<string> => {
  const octokit = await getAuthenticatedOctokit();
  let uniqueRepoName = repoName;
  const projectDesc = description;
  let repo;
  try {
    //create repo
    repo = await octokit.request(`POST /orgs/{org}/repos`, {
      org: config.org,
      name: uniqueRepoName,
      description: projectDesc,
      private: false,
      has_issues: true,
      hash_projects: true,
      has_wiki: true,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (err: unknown) {
    // unique repo name if name already exist
    if (
      typeof err === "object" &&
      err !== null &&
      "status" in err &&
      (err as { status: number }).status == 422 &&
      "message" in err &&
      typeof (err as { message: string }).message === "string" &&
      (err as { message: string }).message.includes("name already exists")
    ) {
      uniqueRepoName = `${repoName}-${uuidv4()}`;
      repo = await octokit.request(`POST /orgs/{org}/repos`, {
        org: config.org,
        name: uniqueRepoName,
        description,
        private: false,
        has_issues: true,
        has_projects: true,
        has_wiki: true,
        headers: {
          "X-Github-Api-Version": "2022-11-28",
        },
      });
    } else {
      throw err;
    }
  }

  //writing files to repo
  const owner = config.org;
  const filesToCreate = [
    {
      path: "projectData.json",
      content: JSON.stringify(projectData, null),
    },
    {
      path: `metaData.json`,
      content: JSON.stringify(metaData, null),
    },
  ];

  await Promise.all(
    filesToCreate.map((file) =>
      octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo: uniqueRepoName,
        path: file.path,
        message: `Add ${file.path}`,
        content: Buffer.from(file.content).toString("base64"),
      })
    )
  );
  await octokit.request("PUT /repos/{owner}/{repo}/topics", {
    owner: config.org,
    repo: uniqueRepoName,
    names: theme,
    headers: {
      Accept: "application/vnd.github.mercy-preview+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return repo.data.html_url;
};
