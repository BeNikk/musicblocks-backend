export const getRepoName = (repoName:string) =>{
    const a = repoName.split("/");
    return a[a.length-1];
}