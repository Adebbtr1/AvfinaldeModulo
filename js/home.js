const api = axios.create({
  baseURL: 'https://rickandmortyapi.com/api'
});

let currentPage = 1;
let totalPages = 1;
const charactersPerPage = 6;

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const characterCards = document.getElementById("character-cards");
  const characterCount = document.getElementById("character-count");
  const locationCount = document.getElementById("location-count");
  const episodeCount = document.getElementById("episode-count");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const pageNumber = document.getElementById("page-number");

  async function fetchCharacters(query = "", page = 1) {
    try {
      const response = await api.get(`/character/?name=${query}&page=${page}`);
      const data = response.data;
      totalPages = Math.ceil(data.info.count / 6);
      displayCharacters(data.results.slice(0, 6));
      characterCount.textContent = data.info.count;
      updatePagination();
    } catch (error) {
      console.error("Erro ao buscar personagens:", error);
    }
  }

  function displayCharacters(characters) {
    if (characters.length === 0) {
      characterCards.innerHTML = '<p>Nenhum personagem encontrado.</p>';
      return;
    }
    characterCards.innerHTML = characters
      .map(character => `
        <div class="col-md-4 mb-4">
          <div class="card mb-3" data-id="${character.id}">
            <div class="row g-0">
              <div class="col-md-4">
                <img src="${character.image}" class="img-fluid rounded-start" alt="${character.name}">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${character.name}</h5>
                  <p class="card-subtitle text-muted">${character.status} - ${character.species}</p>
                  <p class="card-text">Última localização conhecida: ${character.location.name}<br>
                    Visto pela primeira vez em: ${character.origin.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>`).join("");

    document.querySelectorAll(".card").forEach(card => {
      card.addEventListener("click", function () {
        const characterId = this.getAttribute("data-id");
        window.location.href = `detalhes.html?id=${characterId}`;
      });
    });
  }

  async function updateCounts() {
    try {
      const locationsResponse = await api.get("/location");
      const locationsData = locationsResponse.data;
      locationCount.textContent = locationsData.info.count;

      const episodesResponse = await api.get("/episode");
      const episodesData = episodesResponse.data;
      episodeCount.textContent = episodesData.info.count;
    } catch (error) {
      console.error("Erro ao buscar contagens:", error);
    }
  }

  function updatePagination() {
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
    pageNumber.textContent = currentPage;
  }

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    fetchCharacters(query, 1);
    currentPage = 1;
  });

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchCharacters(searchInput.value, currentPage);
    }
  });

  nextPageBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchCharacters(searchInput.value, currentPage);
    }
  });

  fetchCharacters();
  updateCounts();
});
