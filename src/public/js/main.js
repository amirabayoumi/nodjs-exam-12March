document.addEventListener("DOMContentLoaded", () => {
  const languageFilter = document.querySelector("#searchByLang");
  const tagsFilter = document.querySelector("#searchByTags");
  const snippetsTableBody = document.querySelector("#snippetsTable tbody");

  async function fetchFilteredSnippets() {
    const language = languageFilter.value;
    const tags = tagsFilter.value;

    let query = "?";
    if (language && language !== "all") query += `language=${language}&`;
    if (tags && tags !== "all") query += `tags=${tags}&`;

    try {
      const response = await fetch(`/api/snippets${query}`);
      const data = await response.json();

      if (response.ok) {
        updateTable(data.snippets);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching snippets:", error);
    }
  }

  function updateTable(snippets) {
    snippetsTableBody.innerHTML = "";

    if (snippets.length === 0) {
      snippetsTableBody.innerHTML =
        "<tr><td colspan='4'>No snippets found</td></tr>";
      return;
    }

    snippets.forEach((snippet) => {
      const row = document.createElement("tr");

      // Title
      const titleCell = document.createElement("td");
      titleCell.textContent = snippet.title;
      row.appendChild(titleCell);

      // Code
      const codeCell = document.createElement("td");
      codeCell.textContent = snippet.code;
      row.appendChild(codeCell);
      codeCell.style.backgroundColor = "black";
      codeCell.style.color = "white";

      // Language
      const languageCell = document.createElement("td");
      languageCell.textContent = snippet.language;
      row.appendChild(languageCell);

      // Tags
      const tagsCell = document.createElement("td");
      tagsCell.textContent = snippet.tags.join(", ");
      row.appendChild(tagsCell);

      snippetsTableBody.appendChild(row);
    });
  }

  async function populateFilters() {
    try {
      const response = await fetch("/api/snippets");
      const data = await response.json();

      if (response.ok) {
        // Populate language filter
        const uniqueLanguages = [
          ...new Set(data.snippets.map((snippet) => snippet.language)),
        ];

        uniqueLanguages.forEach((language) => {
          const option = document.createElement("option");
          option.value = language;
          option.textContent = language;
          languageFilter.appendChild(option);
        });

        // Populate tags filter
        const allTags = data.snippets.flatMap((snippet) => snippet.tags);
        const uniqueTags = [...new Set(allTags)];

        uniqueTags.forEach((tag) => {
          const option = document.createElement("option");
          option.value = tag;
          option.textContent = tag;
          tagsFilter.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  }

  // Add the "No Filter" option for both language and tags filters
  const noFilterLanguageOption = document.createElement("option");
  noFilterLanguageOption.value = "all";
  noFilterLanguageOption.textContent = "No Filter";
  languageFilter.appendChild(noFilterLanguageOption);

  const noFilterTagsOption = document.createElement("option");
  noFilterTagsOption.value = "all";
  noFilterTagsOption.textContent = "No Filter";
  tagsFilter.appendChild(noFilterTagsOption);

  languageFilter.addEventListener("change", fetchFilteredSnippets);
  tagsFilter.addEventListener("change", fetchFilteredSnippets);

  populateFilters();
  fetchFilteredSnippets();
});
