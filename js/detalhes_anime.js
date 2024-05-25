const auth = firebase.auth();
// Função para buscar os detalhes do anime com base no animeId, incluindo a lista de episódios
async function fetchAnimeInfo(animeId) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let pedidoURL = `https://api.jikan.moe/v4/anime/${animeId}`;

    xhr.open("GET", pedidoURL, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          resolve(data.data);
        } else {
          reject(
            `Erro ao buscar informações do anime ${animeId}: ${xhr.status}`
          );
        }
      }
    };
    xhr.send();
  });
}

async function fetchEpisodes(animeId) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let pedidoURL = `https://api.jikan.moe/v4/anime/${animeId}/episodes`;

    xhr.open("GET", pedidoURL, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          resolve(data.data);
        } else {
          reject(`Erro ao buscar episódios do anime ${animeId}: ${xhr.status}`);
        }
      }
    };
    xhr.send();
  });
}

async function fetchPersonagens(animeId) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let pedidoURL = `https://api.jikan.moe/v4/anime/${animeId}/characters`;

    xhr.open("GET", pedidoURL, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          resolve(data.data);
        } else {
          reject(
            `Erro ao buscar personagens do anime ${animeId}: ${xhr.status}`
          );
        }
      }
    };
    xhr.send();
  });
}

async function fetchReviews(animeId) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let pedidoURL = `https://api.jikan.moe/v4/anime/${animeId}/reviews`;

    xhr.open("GET", pedidoURL, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          resolve(data.data);
        } else {
          reject(`Erro ao buscar reviews do anime ${animeId}: ${xhr.status}`);
        }
      }
    };
    xhr.send();
  });
}

async function fetchRecomendacoes(animeId) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let pedidoURL = `https://api.jikan.moe/v4/anime/${animeId}/recommendations`;

    xhr.open("GET", pedidoURL, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          resolve(data.data);
        } else {
          reject(
            `Erro ao buscar recomendações do anime ${animeId}: ${xhr.status}`
          );
        }
      }
    };
    xhr.send();
  });
}

// Função para buscar a tradução da Sinopse do anime
async function traduzirSinopse(synopsis) {
  const chaveAPI = "SUA_CHAVE_API_DO_GOOGLE_TRANSLATE";
  const texto = synopsis;
  const idiomaDestino = "pt"; // Traduzir para Português

  const url = `https://translation.googleapis.com/language/translate/v2?key=${chaveAPI}&q=${encodeURIComponent(
    texto
  )}&target=${idiomaDestino}`;

  try {
    const response = await fetch(url, {
      method: "POST",
    });

    if (response.ok) {
      const data = await response.json();
      return data.data.translations[0].translatedText;
    } else {
      throw new Error(
        `Erro ao traduzir a sinopse "${synopsis}": ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Erro ao traduzir sinopse:", error);
    return synopsis; // Retorna a sinopse original em caso de erro
  }
}

// Função para exibir os detalhes do anime na página
async function mostrarDetalhesAnime(animeId) {
  try {
    const user = auth.currentUser;
    let animeDetails = await fetchAnimeInfo(animeId);

    // Exibe os detalhes básicos do anime
    document.getElementById("anime-image").src =
      animeDetails.images.jpg.large_image_url;
    document.getElementById("anime-title").textContent = animeDetails.title;
    document.getElementById("anime-synopsis").textContent =
      await traduzirSinopse(animeDetails.synopsis);
    document.getElementById("anime-score").textContent = animeDetails.score;
    document.getElementById("anime-status").textContent = animeDetails.status;
    document.getElementById("anime-airing").textContent =
      animeDetails.aired.string;
    document.getElementById("anime-rating").textContent = animeDetails.rating;
    document.getElementById("anime-url").href = animeDetails.url;

    // Cria e adiciona o botão de favoritos
    // Cria e adiciona o botão de favoritos
    const addToFavoritesBtn = criarBotaoFavorito(animeDetails);
    const animeCard = document.getElementById("anime-card");
    animeCard.appendChild(addToFavoritesBtn);



    // Busca os episódios do anime
    let episodes = await fetchEpisodes(animeId);
    exibirEpisodios(episodes);

    // Busca os personagens do anime
    let personagens = await fetchPersonagens(animeId);
    exibirPersonagens(personagens);

    // Busca as reviews do anime
    let reviews = await fetchReviews(animeId);
    exibirReviews(reviews);

    // Busca as recomendações do anime
    let recomendacoes = await fetchRecomendacoes(animeId);
    exibirRecomendacoes(recomendacoes);

  } catch (error) {
    console.error("Erro ao exibir detalhes do anime:", error);
  }
}



// Limite inicial de itens exibidos
const ITEMS_LIMIT = 5;

function exibirEpisodios(episodes) {
  const episodiosContainer = document.getElementById("episodes-container");
  episodiosContainer.innerHTML = ""; // Limpa o conteúdo anterior
  let displayedEpisodes = 0;

  episodes.slice(0, ITEMS_LIMIT).forEach((episode, index) => {
    episodiosContainer.appendChild(criarElementoEpisodio(episode, index));
    displayedEpisodes++;
  });

  if (episodes.length > ITEMS_LIMIT) {
    const loadMoreButton = criarBotaoCarregarMais(() => {
      episodes
        .slice(displayedEpisodes, displayedEpisodes + ITEMS_LIMIT)
        .forEach((episode, index) => {
          episodiosContainer.insertBefore(
            criarElementoEpisodio(episode, index + displayedEpisodes),
            loadMoreButton
          );
        });
      displayedEpisodes += ITEMS_LIMIT;
      if (displayedEpisodes >= episodes.length) {
        loadMoreButton.style.display = "none";
      }
    });
    episodiosContainer.appendChild(loadMoreButton);
  }
}

function criarElementoEpisodio(episode, index) {
  const episodeElement = document.createElement("div");
  episodeElement.classList.add("episode");
  episodeElement.innerHTML = `
    <div class="episode-title">Episódio ${index + 1}: ${episode.title}</div>`;
  return episodeElement;
}

function exibirPersonagens(personagens) {
  const personagensContainer = document.getElementById("personagens-container");
  personagensContainer.innerHTML = ""; // Limpa o conteúdo anterior
  let displayedPersonagens = 0;

  personagens.slice(0, ITEMS_LIMIT).forEach((personagem, index) => {
    personagensContainer.appendChild(
      criarElementoPersonagem(personagem, index)
    );
    displayedPersonagens++;
  });

  if (personagens.length > ITEMS_LIMIT) {
    const loadMoreButton = criarBotaoCarregarMais(() => {
      personagens
        .slice(displayedPersonagens, displayedPersonagens + ITEMS_LIMIT)
        .forEach((personagem, index) => {
          personagensContainer.insertBefore(
            criarElementoPersonagem(personagem, index + displayedPersonagens),
            loadMoreButton
          );
        });
      displayedPersonagens += ITEMS_LIMIT;
      if (displayedPersonagens >= personagens.length) {
        loadMoreButton.style.display = "none";
      }
    });
    personagensContainer.appendChild(loadMoreButton);
  }
}

function criarElementoPersonagem(personagem) {
  const card = document.createElement("div");
  card.className = "card";

  const image = document.createElement("img");
  image.className = "card-img-top";

  let imageSrc =
    personagem.character.images &&
      personagem.character.images.jpg &&
      personagem.character.images.jpg.image_url
      ? personagem.character.images.jpg.image_url
      : "https://via.placeholder.com/65x60";
  image.src = imageSrc;

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const cardTitle = document.createElement("h5");
  cardTitle.className = "card-title";
  cardTitle.textContent = personagem.character.name;

  cardBody.appendChild(cardTitle);
  card.appendChild(image);
  card.appendChild(cardBody);

  return card;
}

function exibirReviews(reviews) {
  const reviewsContainer = document.getElementById("reviews-container");
  reviewsContainer.innerHTML = "";
  let displayedReviews = 0;

  reviews.slice(0, 1).forEach((review, index) => {
    reviewsContainer.appendChild(criarElementoReview(review, index));
    displayedReviews++;
  });

  if (reviews.length > 1) {
    const loadMoreButton = criarBotaoCarregarMais(() => {
      reviews
        .slice(displayedReviews, displayedReviews + ITEMS_LIMIT)
        .forEach((review, index) => {
          reviewsContainer.insertBefore(
            criarElementoReview(review, index + displayedReviews),
            loadMoreButton
          );
        });
      displayedReviews += ITEMS_LIMIT;
      if (displayedReviews >= reviews.length) {
        loadMoreButton.style.display = "none";
      }
    });
    reviewsContainer.appendChild(loadMoreButton);
  }
}

function criarElementoReview(review) {
  const reviewElement = document.createElement("div");
  reviewElement.classList.add("review");
  reviewElement.innerHTML = `
    <div class="review-autor">Autor: ${review.user.username}</div>
    <div class="review-detalhes">${review.review}</div>
  `;
  return reviewElement;
}

function exibirRecomendacoes(recomendacoes) {
  const recomendacoesContainer = document.getElementById(
    "recomendacoes-container"
  );
  recomendacoesContainer.innerHTML = ""; // Limpa o conteúdo anterior
  let displayedRecomendacoes = 0;

  recomendacoes.slice(0, ITEMS_LIMIT).forEach((recomendacao, index) => {
    recomendacoesContainer.appendChild(
      criarElementoRecomendacao(recomendacao, index)
    );
    displayedRecomendacoes++;
  });

  if (recomendacoes.length > ITEMS_LIMIT) {
    const loadMoreButton = criarBotaoCarregarMais(() => {
      recomendacoes
        .slice(displayedRecomendacoes, displayedRecomendacoes + ITEMS_LIMIT)
        .forEach((recomendacao, index) => {
          recomendacoesContainer.insertBefore(
            criarElementoRecomendacao(
              recomendacao,
              index + displayedRecomendacoes
            ),
            loadMoreButton
          );
        });
      displayedRecomendacoes += ITEMS_LIMIT;
      if (displayedRecomendacoes >= recomendacoes.length) {
        loadMoreButton.style.display = "none";
      }
    });
    recomendacoesContainer.appendChild(loadMoreButton);
  }
}

function criarElementoRecomendacao(recomendacao) {
  const recomendacaoElement = document.createElement("div");
  recomendacaoElement.classList.add("recomendacao");
  recomendacaoElement.innerHTML = `<div class="recomendacao-titulo">${recomendacao.entry.title}</div>`;
  return recomendacaoElement;
}
function criarBotaoFavorito(animeId, animeDetails) {
  const criarBotaoElement = document.createElement("div");
  criarBotaoElement.classList.add("BotaoFavorito");
  const button = document.createElement("button");
  button.textContent = "Adicionar aos Favoritos";
  button.onclick = () => {
    if (animeDetails) {
      addToFavorites(animeDetails.mal_id, animeDetails.title, animeDetails.images.jpg.image_url);
    } else {
      console.error("Detalhes do anime não estão definidos.");
    }
  }};

  function addToFavorites(animeId, animeName, animeImageUrl) {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const favoriteAnime = {
        id: animeId,
        name: animeName,
        imageUrl: animeImageUrl
      };

      db.collection('users').doc(userId).collection('favorites').doc(animeId).set(favoriteAnime)
        .then(() => {
          alert('Anime adicionado aos favoritos!');
          // Aqui você pode adicionar lógica para atualizar a interface do usuário, se necessário
        })
        .catch(error => {
          console.error('Erro ao adicionar anime aos favoritos: ', error);
        });
    } else {
      console.log('Usuário não está autenticado.');
      // Aqui você pode adicionar lógica para lidar com o usuário não autenticado, se necessário
    }
  }


  function criarBotaoCarregarMais(onClick) {
    const loadMoreButton = document.createElement("button");
    loadMoreButton.textContent = "Carregar Mais";
    loadMoreButton.classList.add("btn", "btn-primary");
    loadMoreButton.addEventListener("click", onClick);
    return loadMoreButton;
  }




  // Função para alternar a exibição entre as seções
  function toggleSection(section) {
    const sections = [
      "sinopse-container",
      "episodes-container",
      "personagens-container",
      "status-container",
      "reviews-container",
      "recomendacoes-container",
    ];

    sections.forEach((id) => {
      document.getElementById(id).style.display = "none";
    });

    const sectionId = `${section}-container`;
    const personagemId = `personagens-container`;

    if (sectionId != personagemId) {
      document.getElementById(sectionId).style.display = "block";
    } else {
      document.getElementById(personagemId).style.display = "flex";
    }
  }

  // Função para extrair o animeId da URL
  function getAnimeIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  // Inicializa a página com a sinopse visível
  document.addEventListener("DOMContentLoaded", () => {
    const animeId = getAnimeIdFromURL(); // Obtém o ID do anime da URL
    if (animeId) {
      mostrarDetalhesAnime(animeId);
      toggleSection("sinopse"); // Mostrar a sinopse por padrão
    } else {
      console.error("Anime ID não encontrado na URL");
    }
  });
