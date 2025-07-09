import { generateKey, hashKey, createMetaData } from "../utils/hash";
import { config } from "../config/gitConfig";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getAuthenticatedOctokit } from "../utils/octokit";

export const forkWithHistory = async (
  originalRepo: string
): Promise<{ repoName: string; key: string; success: boolean, projectData:Record<string,unknown> }> => {
  const uuid = uuidv4();
  const uniqueRepoName = `${originalRepo}-fork-${uuid}`;
  const forkedFromURL = `https://github.com/${config.org}/${originalRepo}.git`;
  const newRepoURL = `https://${config.pat}@github.com/${config.org}/${uniqueRepoName}.git`;

  const tempDir = path.join("/tmp", `clone-${uuidv4()}`);
  fs.ensureDirSync(tempDir);

  try {
    execSync(`git clone ${forkedFromURL} ${tempDir}`, { stdio: "inherit" });

    const octokit = await getAuthenticatedOctokit();
    await octokit.request("POST /orgs/{org}/repos", {
      org: config.org,
      name: uniqueRepoName,
      description: `Fork with history of ${originalRepo}`,
      private: false,
    });

    const key = generateKey();
    const hashedKey = hashKey(key);

    const metaDataPath = path.join(tempDir, "metaData.json");
    const existingMeta = fs.existsSync(metaDataPath)
      ? JSON.parse(fs.readFileSync(metaDataPath, "utf-8"))
      : { theme: "default" };

    const newMeta = {
      ...createMetaData(hashedKey, existingMeta.theme || "default"),
      forkedFrom: `https://github.com/${config.org}/${originalRepo}`,
    };

    fs.writeFileSync(metaDataPath, JSON.stringify(newMeta, null, 2));
    const projectDataPath = path.join(tempDir, "projectData.json");
    const projectData = fs.existsSync(projectDataPath)
      ? JSON.parse(fs.readFileSync(projectDataPath, "utf-8"))
      : {};
    execSync(`git config user.name "Musicblocks Bot"`, { cwd: tempDir });
    execSync(`git config user.email "bot@musicblocks.org"`, { cwd: tempDir });

    execSync(`git add metaData.json`, { cwd: tempDir });
    execSync(`git commit -m "Update metaData.json with new hashedKey"`, {
      cwd: tempDir,
    });

    execSync(`git remote remove origin`, { cwd: tempDir });
    execSync(`git remote add origin ${newRepoURL}`, { cwd: tempDir });
    execSync(`git push -u origin main`, { cwd: tempDir });

    return {
      repoName: uniqueRepoName,
      key,
      success: true,
      projectData,
    };
  } catch (err) {
    console.error("Fork with history failed:", err);
    throw err;
  } finally {
    fs.removeSync(tempDir);
  }
};
