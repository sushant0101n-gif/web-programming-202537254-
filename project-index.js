// Build the task index from HTML assignments in the repository. Task links use
// normal browser navigation so each task opens as a full page, not in an iframe.
(async () => {
  const weekList = document.querySelector("#week-list");
  const searchInput = document.querySelector("#project-search");
  const resultCount = document.querySelector("#result-count");
  const emptyState = document.querySelector("#empty-state");
  const footerTotal = document.querySelector("#footer-total");

  function taskLabel(path) {
    const parts = path.split("/");
    const name = parts[parts.length - 1].toLowerCase() === "index.html"
      ? parts[parts.length - 2]
      : parts[parts.length - 1].replace(/\.html?$/i, "");
    return name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim()
      .replace(/\b\w/g, character => character.toUpperCase());
  }

  function filterProjects() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleWeeks = 0;
    let visibleProjects = 0;

    for (const week of weekList.querySelectorAll("[data-week]")) {
      const weekMatches = week.querySelector(".week-title").textContent.toLowerCase().includes(query);
      let matchingProjects = 0;
      for (const link of week.querySelectorAll(".task-link")) {
        const matches = !query || weekMatches || link.textContent.toLowerCase().includes(query);
        link.hidden = !matches;
        if (matches) matchingProjects++;
      }
      week.hidden = matchingProjects === 0;
      if (matchingProjects > 0) {
        visibleWeeks++;
        visibleProjects += matchingProjects;
        if (query) week.open = true;
      } else if (query) {
        week.open = false;
      }
    }

    resultCount.textContent = `${visibleProjects} projects · ${visibleWeeks} weeks`;
    emptyState.textContent = "No matching projects. Try a different search.";
    emptyState.style.display = visibleProjects ? "none" : "block";
  }

  try {
    const response = await fetch(
      "https://api.github.com/repos/sushant0101n-gif/web-programming-202537254-/git/trees/main?recursive=1",
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    const result = await response.json();
    if (result.truncated) throw new Error("Repository tree is truncated");

    const weeks = new Map();
    for (const item of result.tree) {
      if (item.type !== "blob") continue;
      const parts = item.path.split("/");
      const match = parts[0].match(/^week[_-]?(\d+)(?:[_-](\d+))?$/i);
      if (!match) continue;

      const isDirectHtml = parts.length === 2 && /\.html?$/i.test(parts[1]);
      const isBuiltTask = parts.length === 4 && parts[2].toLowerCase() === "dist" && parts[3].toLowerCase() === "index.html";
      if (!isDirectHtml && !isBuiltTask) continue;

      const number = Number(match[1]);
      const part = match[2] ? Number(match[2]) : null;
      const key = parts[0].toLowerCase();
      if (!weeks.has(key)) {
        weeks.set(key, {
          number,
          code: part ? `${String(number).padStart(2, "0")}${String.fromCharCode(64 + part)}` : String(number).padStart(2, "0"),
          title: part ? `Week ${number} · Part ${part}` : `Week ${number}`,
          files: []
        });
      }
      weeks.get(key).files.push([taskLabel(item.path), item.path]);
    }

    const projects = [...weeks.values()].sort((a, b) => a.number - b.number || a.code.localeCompare(b.code));
    if (projects.length) {
      weekList.replaceChildren();
      let total = 0;
      for (const section of projects) {
        section.files.sort((a, b) => a[0].localeCompare(b[0]));
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        const taskGrid = document.createElement("div");
        details.className = "week";
        details.dataset.week = "";
        summary.innerHTML = '<span class="week-number"></span><span class="week-title"></span><span class="week-count"></span><span class="chevron" aria-hidden="true"></span>';
        summary.querySelector(".week-number").textContent = section.code;
        summary.querySelector(".week-title").textContent = section.title;
        summary.querySelector(".week-count").textContent = `${section.files.length} ${section.files.length === 1 ? "project" : "projects"}`;
        taskGrid.className = "task-grid";

        for (const [label, path] of section.files) {
          const link = document.createElement("a");
          link.className = "task-link";
          link.href = path.split("/").map(encodeURIComponent).join("/");
          link.textContent = label;
          // Intentionally do not intercept clicks: the task opens as a page.
          taskGrid.append(link);
        }
        details.append(summary, taskGrid);
        weekList.append(details);
        total += section.files.length;
      }
      footerTotal.textContent = `Project index · ${total} tasks`;
    }
  } catch (error) {
    // Keep the index's built-in links available if the GitHub API is unavailable.
    console.warn("Could not load the complete task list; showing saved tasks.", error);
  }

  weekList.hidden = false;
  searchInput.disabled = false;
  searchInput.addEventListener("input", filterProjects);
  filterProjects();
})();
