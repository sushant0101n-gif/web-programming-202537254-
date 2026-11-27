// Static project index so GitHub Pages does not depend on the GitHub API.
(() => {
  const weekList = document.querySelector("#week-list");
  const searchInput = document.querySelector("#project-search");
  const resultCount = document.querySelector("#result-count");
  const emptyState = document.querySelector("#empty-state");
  const footerTotal = document.querySelector("#footer-total");

  const projects = [
    { week: 1, title: "Week 1", files: [
      ["Task 1", "week_1/Task1.html"], ["Task 2", "week_1/task2.html"],
      ["Task 3", "week_1/task3.html"], ["Task 4", "week_1/task4.html"],
      ["Task 5", "week_1/task5.html"], ["Task 6", "week_1/task6.html"],
      ["Task 7", "week_1/task7.html"], ["Task 8", "week_1/task8.html"]
    ]},
    { week: 2, title: "Week 2 · Part 1", code: "02A", files: [
      ["Task 2", "week2_1/task2.html"], ["Task 3", "week2_1/task3.html"],
      ["Task 4", "week2_1/task4.html"], ["Task 5", "week2_1/task5.html"],
      ["Task 6", "week2_1/task6.html"], ["Task 7", "week2_1/task7.html"],
      ["Task 8", "week2_1/task8.html"], ["Trial page", "week2_1/trial.html"]
    ]},
    { week: 2, title: "Week 2 · Part 2", code: "02B", files: [
      ["Task 1", "week2_2/task1.html"], ["Task 2", "week2_2/task2.html"],
      ["Task 3", "week2_2/task3.html"], ["Task 4", "week2_2/task4.html"],
      ["Task 5", "week2_2/task5.html"], ["Task 6", "week2_2/task6.html"],
      ["Task 7", "week2_2/task7.html"], ["Task 8", "week2_2/task8.html"]
    ]},
    { week: 3, title: "Week 3 · Part 1", code: "03A", files: [
      ["Task 1", "week3_1/task1.html"], ["Task 2", "week3_1/task2.html"],
      ["Task 3", "week3_1/task3.html"], ["Task 4", "week3_1/task4.html"],
      ["Task 5", "week3_1/task5.html"], ["Task 6", "week3_1/task6.html"],
      ["Task 7", "week3_1/task7.html"], ["Task 8", "week3_1/task8.html"]
    ]},
    { week: 3, title: "Week 3 · Part 2", code: "03B", files: [
      ["Task 1", "week3_2/task1.html"], ["Task 2", "week3_2/task2.html"],
      ["Task 3", "week3_2/task3.html"], ["Task 4", "week3_2/task4.html"],
      ["Task 5", "week3_2/task5.html"], ["Task 6", "week3_2/task6.html"],
      ["Task 7", "week3_2/task7.html"]
    ]},
    { week: 4, title: "Week 4 · Part 1", files: [
      ["Task 1", "week4_1/task1.html"], ["Task 2", "week4_1/task2.html"],
      ["Task 3", "week4_1/task3.html"], ["Task 4", "week4_1/task4.html"]
    ]},
    { week: 5, title: "Week 5", files: [
      ["Counter", "week5/counter.html"], ["Grade Calculator", "week5/grade calculator.html"],
      ["Loops", "week5/loops.html"]
    ]},
    { week: 6, title: "Week 6", files: [
      ["Blog fetcher", "Week_6/Blog fetcher.html"], ["Country explorer", "Week_6/country explorer.html"],
      ["Joke fetcher", "Week_6/joke fetcher.html"], ["Pokemon explorer", "Week_6/pokemon explorer.html"],
      ["Random profile generator", "Week_6/random profile generator.html"], ["Seoul weather", "Week_6/seoul weather.html"]
    ]},
    { week: 7, title: "Week 7", files: [
      ["Book search", "week7/book search.html"], ["Step 1", "week7/step1.html"],
      ["Step 2", "week7/step2.html"], ["Step 3", "week7/step3.html"],
      ["Step 4", "week7/step4.html"], ["Step 5", "week7/step 5.html"], ["Step 6", "week7/step6.html"]
    ]},
    { week: 8, title: "Week 8 · Part 1", code: "08", files: [
      ["React Project", "week8_1/dist/index.html"]
    ]},
    { week: 8, title: "Week 8 · Part 2", code: "08", files: [
      ["React Project", "week8_2/dist/index.html"]
    ]}
  ];

  weekList.replaceChildren();
  let total = 0;

  for (const section of projects) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const taskGrid = document.createElement("div");

    details.className = "week";
    details.dataset.week = "";
    summary.innerHTML = `<span class="week-number"></span><span class="week-title"></span><span class="week-count"></span><span class="chevron" aria-hidden="true"></span>`;

    summary.querySelector(".week-number").textContent = section.code || String(section.week).padStart(2, "0");
    summary.querySelector(".week-title").textContent = section.title;
    summary.querySelector(".week-count").textContent = `${section.files.length} ${section.files.length === 1 ? "project" : "projects"}`;
    taskGrid.className = "task-grid";

    for (const [label, path] of section.files) {
      const link = document.createElement("a");
      link.className = "task-link";
      link.href = path.split("/").map(encodeURIComponent).join("/");
      link.textContent = label;
      taskGrid.append(link);
    }

    details.append(summary, taskGrid);
    weekList.append(details);
    total += section.files.length;
  }

  weekList.hidden = false;
  emptyState.style.display = "none";
  footerTotal.textContent = `Project index · ${total} tasks`;

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
      }
    }

    resultCount.textContent = `${visibleProjects} projects · ${visibleWeeks} weeks`;
    emptyState.style.display = visibleProjects ? "none" : "block";
  }

  searchInput.disabled = false;
  searchInput.addEventListener("input", filterProjects);
  filterProjects();
})();
