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

  languageFilter.addEventListener("change", fetchFilteredSnippets);
  tagsFilter.addEventListener("change", fetchFilteredSnippets);

  fetchFilteredSnippets();
});
