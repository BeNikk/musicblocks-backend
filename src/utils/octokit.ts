import { Octokit } from "octokit";
import { getInstallationToken } from "../services/getToken";

export async function getAuthenticatedOctokit(): Promise<Octokit> {
    const token = await getInstallationToken();
    return new Octokit({ auth: token });
}