const api = axios.create({
  baseURL: 'https://rickandmortyapi.com/api'
});

document.addEventListener("DOMContentLoaded", function () {
  const characterDetails = document.getElementById("character-details");
  const backToListBtn = document.getElementById("back-to-list");

  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get('id');

  async function fetchCharacterDetails(id) {
    try {
      const response = await api.get(`/character/${id}`);
      const character = response.data;
      displayCharacterDetails(character);
    } catch (error) {
      console.error("Erro ao buscar detalhes do personagem:", error);
    }
  }

  function displayCharacterDetails(character) {
    characterDetails.innerHTML = `
      <div class="col-md-4">
        <img src="${character.image}" class="img-fluid rounded-start" alt="${character.name}">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${character.name}</h5>
          <p class="card-subtitle text-muted">${character.status} - ${character.species}</p>
          <p class="card-text">Gênero: ${character.gender}<br>
            Última localização conhecida: ${character.location.name}<br>
            Visto pela primeira vez em: ${character.origin.name}</p>
        </div>
      </div>`;

    backToListBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  fetchCharacterDetails(characterId);
});
