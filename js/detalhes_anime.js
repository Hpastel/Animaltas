const auth = firebase.auth();

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

async function traduzirSinopse(synopsis) {
  const chaveAPI = "SUA_CHAVE_API_DO_GOOGLE_TRANSLATE";
  const texto = synopsis;
  const idiomaDestino = "pt";

  const url = `https://translation.googleapis.com/language/translate/v2?key=${chaveAPI}&q=${encodeURIComponent(
    texto
  )}&target=${idiomaDestino}`;

  try {
    const response = await fetch(url, { method: "POST" });

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
    return synopsis;
  }
}

async function mostrarDetalhesAnime(animeId) {
  try {
    const user = await waitForUserAuth();
    let animeDetails = await fetchAnimeInfo(animeId);
    console.log("Detalhes do anime:", animeDetails); // Log para depuração

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

    // Verificar se o usuário está autenticado
    if (user) {
      const userId = user.uid;
      const favoritesRef = firebase.database().ref(`users/${userId}/favorites`);

      favoritesRef.once("value", (snapshot) => {
        if (snapshot.exists()) {
          let isFavorite = false;

          snapshot.forEach((childSnapshot) => {
            const favoriteAnime = childSnapshot.val();
            if (favoriteAnime.id === animeId.toString()) {
              isFavorite = true;
              return;
            }
          });
          if (isFavorite) {
            const addToFavoritesBtn = document.getElementById('favoritos')
            addToFavoritesBtn.textContent = "Já nos Favoritos";
            addToFavoritesBtn.disabled = true;
            const animeCard = document.getElementById("anime-card");
            animeCard.appendChild(addToFavoritesBtn);
          } else {
            const addToFavoritesBtn = criarBotaoFavorito(animeDetails);
            const animeCard = document.getElementById("anime-card");
            animeCard.appendChild(addToFavoritesBtn);
          }
        } else {
          const addToFavoritesBtn = criarBotaoFavorito(animeDetails);
          const animeCard = document.getElementById("anime-card");
          animeCard.appendChild(addToFavoritesBtn);
        }
      });
    } else {
      console.log("Usuário não autenticado.");
      // Se o usuário não estiver autenticado, apenas cria o botão padrão
      const addToFavoritesBtn = criarBotaoFavorito(animeDetails);
      const animeCard = document.getElementById("anime-card");
      animeCard.appendChild(addToFavoritesBtn);
    }

    let episodes = await fetchEpisodes(animeId);
    exibirEpisodios(episodes);

    let personagens = await fetchPersonagens(animeId);
    exibirPersonagens(personagens);

    let reviews = await fetchReviews(animeId);
    exibirReviews(reviews);

    let recomendacoes = await fetchRecomendacoes(animeId);
    exibirRecomendacoes(recomendacoes);
  } catch (error) {
    console.error("Erro ao exibir detalhes do anime:", error);
  }
}
async function waitForUserAuth() {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe(); // Remover o listener após receber a resposta
      resolve(user);
    });
  });
}
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

async function addToFavorites(animeId, title, imageUrl) {
  const user = auth.currentUser;

  if (user) {
    const userId = user.uid;
    const favoritesRef = firebase
      .database()
      .ref("users/" + userId + "/favorites");

    const newFavorite = {
      id: animeId.toString(),
      title: title,
      imageUrl: imageUrl,
    };

    try {
      await favoritesRef.push(newFavorite);
      location.reload();
    } catch (error) {
      console.error("Erro ao adicionar anime aos favoritos:", error);
    }
  } else {
    console.log("Usuário não autenticado.");
  }
}
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get("id");
  if (animeId) {
    mostrarDetalhesAnime(animeId);
  } else {
    console.error("ID do anime não especificado na URL.");
  }
};
