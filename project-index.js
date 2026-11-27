(() => {
  const owner = "sushant0101n-gif";
  const repository = "web-programming-202537254-";
  const weekFolderPattern = /^week[_-]?(\d+)(?:[_-](\d+))?$/i;

  const weekList = document.querySelector("#week-list");
  const searchInput = document.querySelector("#project-search");
  const resultCount = document.querySelector("#result-count");
  const emptyState = document.querySelector("#empty-state");
  const footerTotal = document.querySelector("#footer-total");

  weekList.replaceChildren();
  weekList.hidden = true;
  searchInput.disabled = true;
  emptyState.textContent = "Loading projects...";
  emptyState.style.display = "block";
  resultCount.textContent = "Loading projects...";

  function parseTaskLabel(fileName, path = "") {
    const normalizedPath = path.toLowerCase();

    const labels = {
      "week13_1/course-feedback-form/dist/index.html": "Course Feedback Form",
      "week13_1/student-profile-editor/dist/index.html": "Student Profile Editor",
      "week13_1/bio-field/dist/index.html": "Live Character Counter",
      "week13_1/contact-form-with-validation/dist/index.html": "Contact Form with Validation",
      "week12/dist/index.html": "Shopping Cart",
      "week12/toogle visibility.html": "Exercise 1 — Toggle visibility",
      "week12/add remove item.html": "Exercise 2 — Add & remove items from a list",
      "week12/lift state between 2 counter.html": "Exercise 3 — Lift state between two counters",
      "week12_2/dist/index.html": "GitHub User Lookup",
      "week12_2/weather-dashboard/dist/index.html": "Weather Dashboard",
      "week12_2/counter with history.html": "Counter with History"
    };

    if (labels[normalizedPath]) return labels[normalizedPath];

    const name = fileName.replace(/\.[^.]+$/, "");
    const taskMatch = name.match(/^task\s*(\d+)/i);

    if (taskMatch) return `Task ${taskMatch[1]}`;
    if (/^trial$/i.test(name)) return "Trial page";
    if (/^counter$/i.test(name)) return "Counter";
    if (/^grade calculator$/i.test(name)) return "Grade Calculator";

    return name
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (character) => character.toUpperCase());
  }

  function makeWeek(folder, files) {
    const match = folder.match(weekFolderPattern);
    if (!match) return null;

    const number = Number(match[1]);
    const part = match[2] ? Number(match[2]) : null;
    const code = String(number).padStart(2, "0");
    const displayCode = part && number >= 2 && number <= 3
      ? `${code}${String.fromCharCode(64 + part)}`
      : code;

    const title = `Week ${number}${part ? ` · Part ${part}` : ""}`;
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const taskGrid = document.createElement("div");

    details.className = "week";
    details.dataset.week = "";
    summary.innerHTML = `
      <span class="week-number"></span>
      <span class="week-title"></span>
      <span class="week-count"></span>
      <span class="chevron" aria-hidden="true"></span>
    `;
    summary.querySelector(".week-number").textContent = displayCode;
    summary.querySelector(".week-title").textContent = title;
    summary.querySelector(".week-count").textContent =
      `${files.length} ${files.length === 1 ? "project" : "projects"}`;
    taskGrid.className = "task-grid";

    for (const path of files) {
      const fileName = path.split("/").pop();
      const link = document.createElement("a");
      const label = document.createElement("span");
      const linkPath = path.split("/").map(encodeURIComponent).join("/");

      link.className = "task-link";
      link.href = linkPath;
      label.textContent = parseTaskLabel(fileName, path);
      link.append(label);
      taskGrid.append(link);
    }

    details.append(summary, taskGrid);
    return { details, number, part: part ?? 0, count: files.length };
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

  async function loadProjects() {
    try {
      const url = `https://api.github.com/repos/${owner}/${repository}/contents?ref=main&per_page=100`;
      const response = await fetch(url, {
        headers: { Accept: "application/vnd.github+json" },
        cache: "no-store"
      });

      if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}`);

      const rootEntries = await response.json();
      if (!Array.isArray(rootEntries)) throw new Error("Invalid GitHub directory response");

      const filesByWeek = new Map();

      async function scanDirectory(path, depth = 0) {
        if (depth > 4) return;

        const directoryUrl = `https://api.github.com/repos/${owner}/${repository}/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=main&per_page=100`;
        const directoryResponse = await fetch(directoryUrl, {
          headers: { Accept: "application/vnd.github+json" },
          cache: "no-store"
        });

        if (!directoryResponse.ok) throw new Error(`GitHub returned HTTP ${directoryResponse.status}`);
        const entries = await directoryResponse.json();
        if (!Array.isArray(entries)) return;

        for (const entry of entries) {
          if (entry.type === "dir") {
            await scanDirectory(entry.path, depth + 1);
          } else if (entry.type === "file" && /\.html$/i.test(entry.name)) {
            const [folder, ...fileParts] = entry.path.split("/");
            if (!weekFolderPattern.test(folder) || fileParts.length === 0) continue;

            const relativePath = fileParts.join("/").toLowerCase();
            const folderLower = folder.toLowerCase();

            if (folderLower === "week12" && relativePath === "index.html") continue;
            if (folderLower === "week12_2" && relativePath === "index.html") continue;

            if (folderLower === "week13_1") {
              if (!relativePath.includes("/dist/index.html") && relativePath !== "dist/index.html") continue;
              if (relativePath === "index.html") continue;
            }

            if (folderLower === "week12") {
              if (fileParts.length > 1 && relativePath !== "dist/index.html") continue;
            }

            if (folderLower === "week12_2") {
              const isDirectProject = fileParts.length === 1;
              const isBuiltProject = relativePath === "dist/index.html" || relativePath === "weather-dashboard/dist/index.html";
              if (!isDirectProject && !isBuiltProject) continue;
            }

            if (!filesByWeek.has(folder)) filesByWeek.set(folder, []);
            filesByWeek.get(folder).push(entry.path);
          }
        }
      }

      const weekDirectories = rootEntries.filter((entry) =>
        entry.type === "dir" && weekFolderPattern.test(entry.name)
      );

      for (const directory of weekDirectories) {
        await scanDirectory(directory.path);
      }

      const weeks = [...filesByWeek.entries()]
        .map(([folder, files]) => makeWeek(folder, files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))))
        .filter(Boolean)
        .sort((a, b) => a.number - b.number || a.part - b.part);

      weekList.replaceChildren(...weeks.map((week) => week.details));
      weekList.hidden = false;
      searchInput.disabled = false;

      const totalProjects = weeks.reduce((total, week) => total + week.count, 0);
      footerTotal.textContent = `Project index · ${totalProjects} tasks`;

      if (totalProjects === 0) {
        emptyState.textContent = "No HTML project files were found in the week folders.";
        emptyState.style.display = "block";
        resultCount.textContent = "0 projects · 0 weeks";
        return;
      }

      emptyState.style.display = "none";
      searchInput.addEventListener("input", filterProjects);
      filterProjects();
    } catch (error) {
      console.error("Unable to load the project index:", error);
      weekList.replaceChildren();
      emptyState.textContent = "Could not load projects from GitHub. Check your connection and refresh the page.";
      emptyState.style.display = "block";
      resultCount.textContent = "Project list unavailable";
      footerTotal.textContent = "Project index unavailable";
    }
  }

  loadProjects();
})();
