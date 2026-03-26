const container = document.getElementById("projects-container");

async function loadProjects() {
  const res = await fetch("https://api.github.com/users/DHIRAJK20946041/repos");
  const repos = await res.json();

  const filtered = repos.slice(0, 6);

  filtered.forEach(repo => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description"}</p>
      <a href="${repo.html_url}" target="_blank">View Repo</a>
    `;

    container.appendChild(div);
  });
}

loadProjects();