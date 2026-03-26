import { CONFIG } from "./config.js";

export async function fetchRepos() {
  const res = await fetch(`${CONFIG.api.github}/users/${CONFIG.githubUsername}/repos`);
  return res.json();
}