// Static project index: curated task list, with no automatic repository scanning.
(() => {
  const weekList = document.querySelector("#week-list");
  const searchInput = document.querySelector("#project-search");
  const resultCount = document.querySelector("#result-count");
  const emptyState = document.querySelector("#empty-state");
  const footerTotal = document.querySelector("#footer-total");

  const projects = [
    { week: 1, title: "Week 1", files: [["Task 1","week_1/Task1.html"],["Task 2","week_1/task2.html"],["Task 3","week_1/task3.html"],["Task 4","week_1/task4.html"],["Task 5","week_1/task5.html"],["Task 6","week_1/task6.html"],["Task 7","week_1/task7.html"],["Task 8","week_1/task8.html"]] },
    { week: 2, title: "Week 2 · Part 1", code: "02A", files: [["Task 2","week2_1/task2.html"],["Task 3","week2_1/task3.html"],["Task 4","week2_1/task4.html"],["Task 5","week2_1/task5.html"],["Task 6","week2_1/task6.html"],["Task 7","week2_1/task7.html"],["Task 8","week2_1/task8.html"],["Trial page","week2_1/trial.html"]] },
    { week: 2, title: "Week 2 · Part 2", code: "02B", files: [["Task 1","week2_2/task1.html"],["Task 2","week2_2/task2.html"],["Task 3","week2_2/task3.html"],["Task 4","week2_2/task4.html"],["Task 5","week2_2/task5.html"],["Task 6","week2_2/task6.html"],["Task 7","week2_2/task7.html"],["Task 8","week2_2/task8.html"]] },
    { week: 3, title: "Week 3 · Part 1", code: "03A", files: [["Task 1","week3_1/task1.html"],["Task 2","week3_1/task2.html"],["Task 3","week3_1/task3.html"],["Task 4","week3_1/task4.html"],["Task 5","week3_1/task5.html"],["Task 6","week3_1/task6.html"],["Task 7","week3_1/task7.html"],["Task 8","week3_1/task8.html"]] },
    { week: 3, title: "Week 3 · Part 2", code: "03B", files: [["Task 1","week3_2/task1.html"],["Task 2","week3_2/task2.html"],["Task 3","week3_2/task3.html"],["Task 4","week3_2/task4.html"],["Task 5","week3_2/task5.html"],["Task 6","week3_2/task6.html"],["Task 7","week3_2/task7.html"]] },
    { week: 4, title: "Week 4 · Part 1", files: [["Task 1","week4_1/task1.html"],["Task 2","week4_1/task2.html"],["Task 3","week4_1/task3.html"],["Task 4","week4_1/task4.html"]] },
    { week: 5, title: "Week 5", files: [["Counter","week5/counter.html"],["Grade Calculator","week5/grade calculator.html"],["Loops","week5/loops.html"]] },
    { week: 6, title: "Week 6", files: [["Blog fetcher","Week_6/Blog fetcher.html"],["Country explorer","Week_6/country explorer.html"],["Joke fetcher","Week_6/joke fetcher.html"],["Pokemon explorer","Week_6/pokemon explorer.html"],["Random profile generator","Week_6/random profile generator.html"],["Seoul weather","Week_6/seoul weather.html"]] },
    { week: 7, title: "Week 7", files: [["Book search","week7/book search.html"],["Step 1","week7/step1.html"],["Step 2","week7/step2.html"],["Step 3","week7/step3.html"],["Step 4","week7/step4.html"],["Step 5","week7/step 5.html"],["Step 6","week7/step6.html"]] },
    { week: 8, title: "Week 8 · Part 1", code: "08A", files: [["Add valid attributes","week8_1/E2 Addind valid attributes.html"],["Add CSS","week8_1/E3 adding css.html"],["Student registration","week8_1/Student registration.html"],["Login form","week8_1/login form.html"]] },
    { week: 8, title: "Week 8 · Part 2", code: "08B", files: [["C1","week8_2/C1.html"],["E1","week8_2/E1.html"],["E2","week8_2/E2.html"],["E3","week8_2/E3.html"],["Upgraded registration form","week8_2/Upgraded Registration form.html"],["C2","week8_2/c2.html"]] },
    { week: 9, title: "Week 9 · Part 1", code: "09A", files: [["Accessibility audit report","week9_1/Accessibility Audit Report.html"],["Alt text","week9_1/Alt text.html"],["Div button","week9_1/div button.html"],["Lighthouse fix","week9_1/lighthouse fix.html"]] },
    { week: 9, title: "Week 9 · Part 2", code: "09B", files: [["Adding defer","week9_2/adding defer.html"],["Comparing image format","week9_2/comparing image format.html"],["Performance report","week9_2/performance report.html"],["Performance test page","week9_2/performance test page.html"]] },
    { week: 10, title: "Week 10 · Part 1", code: "10A", files: [["Task 1","week10_1/task1.html"],["Task 2","week10_1/task2.html"]] },
    { week: 10, title: "Week 10 · Part 2", code: "10B", files: [["Book search","week10_2/book-search.html"]] },
    { week: 11, title: "Week 11 · Part 1", code: "11A", files: [["Card component","week11_1/CardComponen.html"],["Notification list","week11_1/NotificationList.html"],["Profile card component","week11_1/profile card component.html"],["Student profile card","week11_1/student profile card.html"]] },
    { week: 11, title: "Week 11 · Part 2", code: "11B", files: [["Conditional rendering","week11_2/conditional rendering.html"],["Course catalog","week11_2/course catalog.html"],["Product card","week11_2/product card.html"]] },
    { week: 12, title: "Week 12", files: [["Shopping cart","week12/dist/index.html"],["Toggle visibility","week12/toogle visibility.html"],["Add & remove items","week12/add remove item.html"],["Lift state between counters","week12/lift state between 2 counter.html"]] },
    { week: 12, title: "Week 12 · Part 2", code: "12B", files: [["GitHub user lookup","week12_2/dist/index.html"],["Weather dashboard","week12_2/weather-dashboard/dist/index.html"],["Counter with history","week12_2/counter with history.html"],["Page title sync","week12_2/page title sync.html"],["React stopwatch","week12_2/react stopwatch.html"],["User profile fetch","week12_2/user profile fetch.html"]] },
    { week: 13, title: "Week 13 · Part 1", code: "13A", files: [["Course feedback form","week13_1/course-feedback-form/dist/index.html"],["Student profile editor","week13_1/student-profile-editor/dist/index.html"],["Live character counter","week13_1/bio-field/dist/index.html"],["Contact form with validation","week13_1/contact-form-with-validation/dist/index.html"],["Skill Checklist with Counter","week13_1/skill-checklist-with-counter/dist/index.html"]] }
  ];

  let activeDialog;

  function openTask(label, path) {
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    if (!activeDialog) {
      activeDialog = document.createElement("section");
      activeDialog.id = "task-viewer";
      activeDialog.className = "task-viewer";
      activeDialog.hidden = true;
      activeDialog.innerHTML = `<div class="task-viewer-bar"><strong id="task-viewer-title"></strong><button type="button" id="task-viewer-close" aria-label="Close task">×</button></div><iframe id="task-frame" title="Selected task"></iframe>`;
      document.querySelector("main").append(activeDialog);
      document.getElementById("task-viewer-close").addEventListener("click", closeTask);
    }

    document.getElementById("task-viewer-title").textContent = label;
    document.getElementById("task-frame").src = encodedPath;
    activeDialog.hidden = false;
    activeDialog.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeTask() {
    if (!activeDialog) return;
    document.getElementById("task-frame").removeAttribute("src");
    activeDialog.hidden = true;
  }

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
      link.addEventListener("click", event => {
        event.preventDefault();
        openTask(label, path);
      });
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
      } else if (query) week.open = false;
    }

    resultCount.textContent = `${visibleProjects} projects · ${visibleWeeks} weeks`;
    emptyState.textContent = "No matching projects. Try a different search.";
    emptyState.style.display = visibleProjects ? "none" : "block";
  }

  searchInput.disabled = false;
  searchInput.addEventListener("input", filterProjects);
  filterProjects();
})();
