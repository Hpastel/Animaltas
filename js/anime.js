const animeCardTemplate = document.getElementById("anime-template");
const animeCardContainer = document.getElementById("anime-card-container");
const searchInput = document.getElementById("search");
let paginationContainer = document.getElementById("pagination-container");
const opcoes = document.getElementById("opcoes");
let animeData = [];
let currentPage = 1;
const itemsPerPage = 25;
const maxPagesToShow = 11;

document.getElementById("opcoes").addEventListener("change", function () {
  const selectedOption = this.value;
  console.log(selectedOption);

  const sections = document.querySelectorAll(".vertical-bar");
  sections.forEach((section) => {
    section.style.display = "none";
  });

  // Use querySelector para selecionar a seção específica baseada no valor da opção selecionada
  const selectedOptionSection = document.querySelector(
    `.vertical-bar.${selectedOption}`
  );
  if (selectedOptionSection) {
    selectedOptionSection.style.display = "block";
  }

  // Corrija a lógica de redirecionamento
  if (selectedOption === "Game") {
    window.location.hash = "game.html";
  }
});

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.trim(); // Remova espaços em branco extras
  if (value !== "") {
    fetchGlobalAnimeData(value);
  } else {
    fetchAnimeData(currentPage);
  }
});

async function fetchAnimeData(page) {
  try {
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/https://api.jikan.moe/v4/top/anime?page=${page}`
    );
    const data = await response.json();

    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      animeData = data.data;
      renderAnimeCards(animeData, page);
      renderPagination(data.pagination);
    } else {
      console.error("Error fetching data: Invalid data format");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchGlobalAnimeData(searchQuery) {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime?q=${searchQuery}&sfw=true`
    );
    const data = await response.json();

    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      animeData = data.data;
      renderAnimeCards(animeData);
    } else {
      console.error("Error fetching data: Invalid data format");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
function renderAnimeCards(data, page, current_page) {
  console.log("Rendering anime cards for page", page);
  console.log("Received data:", data);

  // Limpa o conteúdo do container antes de adicionar os novos cards
  animeCardContainer.innerHTML = "";

  // Itera sobre os dados para criar e adicionar os cards ao container
  data.forEach((anime) => {
    // Cria um novo card
    const card = document.createElement("div");
    card.classList.add("card"); // Adiciona a classe 'anime-card'

    // Preenche o conteúdo do card com a estrutura do template
    card.innerHTML = `
            <img class="card-img-top" data-image>
            <div class="card-body">
                <h5 class="card-title" data-header></h5>
                <p class="card-text" data-body></p>
            </div>
        `;

    // Atualiza as propriedades dos elementos do card
    const header = card.querySelector("[data-header]");
    header.textContent = anime.title;

    const image = card.querySelector(".card-img-top");
    let imageSrc =
      anime.images && anime.images.jpg && anime.images.jpg.image_url
        ? anime.images.jpg.image_url
        : "https://via.placeholder.com/300x450";
    image.src = imageSrc;

    // Adiciona o evento de clique na imagem para redirecionar para a página de detalhes
    image.addEventListener("click", function () {
      let animeId = anime.mal_id;
      window.location.href = `html/detalhes_anime.html?id=${animeId}`;
    });

    // Adiciona o card ao container
    animeCardContainer.appendChild(card);
  });
}

function renderPagination(pagination) {
  if (!paginationContainer) {
    paginationContainer = document.getElementById("pagination-container");
  }
  if (!paginationContainer) {
    console.error("Pagination container not found");
    return;
  }
  paginationContainer.innerHTML = "";
  const totalPages = pagination.last_visible_page;
  let currentPage = pagination.current_page;
  console.log(currentPage);
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > maxPagesToShow) {
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    startPage = currentPage - halfMaxPages;
    endPage = currentPage + halfMaxPages;

    if (startPage < 1) {
      startPage = 1;
      endPage = maxPagesToShow;
    }
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - maxPagesToShow + 1;
      if (startPage < 1) {
        startPage = 1;
      }
    }
  }

  if (currentPage > 1) {
    const prevPageLink = document.createElement("a");
    prevPageLink.href = "#";
    prevPageLink.textContent = "Anterior";
    prevPageLink.addEventListener("click", function () {
      fetchAnimeData(currentPage - 1);
    });
    paginationContainer.appendChild(prevPageLink);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.textContent = i;
    if (i === currentPage) {
      pageLink.classList.add("active");
    }
    pageLink.addEventListener("click", function () {
      fetchAnimeData(i);
    });
    paginationContainer.appendChild(pageLink);
  }

  if (currentPage < totalPages) {
    const nextPageLink = document.createElement("a");
    nextPageLink.href = "#";
    nextPageLink.textContent = "Próximo";
    nextPageLink.addEventListener("click", function () {
      fetchAnimeData(currentPage + 1);
    });
    paginationContainer.appendChild(nextPageLink);
  }
}
async function fetchAndDisplayAnimeNews(limit) {
  const newsList = document.getElementById("news-list");

  try {
    const response = await fetch(
      "https://cors-anywhere.herokuapp.com/https://www.animenewsnetwork.com/news/rss.xml"
    );
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const items = xmlDoc.querySelectorAll("item");
    const totalItems = items.length;
    const itemsToDisplay = Math.min(totalItems, limit);

    for (let i = 0; i < itemsToDisplay; i++) {
      const item = items[i];
      const title = item.querySelector("title").textContent;
      const link = item.querySelector("link").textContent;

      const listItem = document.createElement("li");
      const linkElement = document.createElement("a");
      linkElement.href = link;
      linkElement.textContent = title;
      listItem.appendChild(linkElement);
      newsList.appendChild(listItem);
    }
  } catch (error) {
    console.error(
      "Erro ao buscar notícias sobre animes na Anime News Network:",
      error
    );
  }
}
//seleção só para mobile
const mediaQuery = window.matchMedia('(max-width: 420px)');
if (mediaQuery.matches) {

  document.getElementById("opcoes").addEventListener("change", function () {
    const selectedOption = this.value;
    console.log(selectedOption);

    const sections = document.querySelectorAll(".info");
    sections.forEach((section) => {
      section.style.display = "none";
    });

    let selectedOptionSection;
    if (selectedOption === "Animes") {
      selectedOptionSection = document.getElementById("animes");
    } else if (selectedOption === "News") {
      selectedOptionSection = document.getElementById("news");
    } else if (selectedOption === "Game") {
      window.location.href = "html/jogo.html";
      return;
    } else if (selectedOption === "Login") {
      window.location.href = "html/login.html";
      return;
    } else if (selectedOption === "Register") {
      window.location.href = "html/register.html";
      return;
    } else if (selectedOption === "Perfil"){
      window.location.href = "html/perfil.html";
    }

    if (selectedOptionSection) {
      selectedOptionSection.style.display = "block";
    }
  });
  // Exibir a seção "Animes" por padrão
  document.getElementById("animes").style.display = "block";
};

// Chamando a função fetchAndDisplayAnimeNews com limite de 5 notícias
fetchAndDisplayAnimeNews(20);

fetchAnimeData(currentPage);


