export function sanitizeTopics(topics: string[]): string[] {
  return topics
    .map(topic =>
      topic
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50)
    )
    .filter(topic => /^[a-z0-9][a-z0-9-]*$/.test(topic)); 
}