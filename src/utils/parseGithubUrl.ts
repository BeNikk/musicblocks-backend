export function parseGitHubRepoUrl(url: string): { owner: string; repo: string } | null {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)(?:\.git)?$/);
    if (!match) return null;
    return { owner: match[1], repo: match[2] };
}