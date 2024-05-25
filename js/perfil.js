const auth = firebase.auth();

// Função para carregar o perfil do usuário
function loadProfile() {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        db.collection('users').doc(userId).get().then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                document.getElementById('userName').value = userData.name || '';
                document.getElementById('userEmail').value = userData.email || '';
                document.getElementById('userBio').value = userData.bio || '';
            } else {
                console.log('No such document!');
            }
        }).catch(error => {
            console.log('Error getting document:', error);
        });
    } else {
        console.log('No user is signed in.');
    }
}

// Função para carregar animes a partir da API e exibir na página// Função para carregar animes a partir da API e exibir na página
function loadAnimes() {
    fetch('https://api.jikan.moe/v4/top/anime')
        .then(response => response.json())
        .then(data => {
            const animes = data.data;
            const animeList = document.getElementById('animeList');
            animeList.innerHTML = ''; // Limpar lista de animes
            animeList.classList.add('card')
            animes.forEach(anime => {
                const animeItem = document.createElement('div');
                animeItem.className = 'anime-item';

                // Verifica se a URL da imagem está disponível na resposta da API
                const imageUrl = anime.images && anime.images.jpg && anime.images.jpg.image_url ? anime.images.jpg.image_url : 'https://via.placeholder.com/300x450';

                animeItem.innerHTML = `
                    <h5 class="card-title">${anime.title}</h5>
                    <img class="card-img-top" src="${imageUrl}" alt="${anime.title}">
                    <button onclick="addToFavorites('${anime.mal_id}', '${anime.title}', '${imageUrl}')">Adicionar aos Favoritos</button>
                `;
                animeList.appendChild(animeItem);
            });
        }).catch(error => {
            console.error('Erro ao carregar animes: ', error);
        });
}

// Função para adicionar anime aos favoritos do usuário
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
                loadFavoriteAnimes(); // Atualizar a lista de favoritos
            })
            .catch(error => {
                console.error('Erro ao adicionar anime aos favoritos: ', error);
            });
    } else {
        console.log('Usuário não está autenticado.');
    }
}


// Função para carregar animes favoritos do usuário e permitir edição
function loadFavoriteAnimes() {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;

        db.collection('users').doc(userId).collection('favorites').get()
            .then(querySnapshot => {
                const favoriteList = document.getElementById('favoriteList');
                favoriteList.innerHTML = ''; // Limpar lista de favoritos

                querySnapshot.forEach(doc => {
                    const favoriteAnime = doc.data();
                    const favoriteItem = document.createElement('div');
                    favoriteItem.className = 'favorite-item';

                    // Verifica se a URL da imagem está disponível
                    const imageUrl = favoriteAnime.imageUrl ? favoriteAnime.imageUrl : 'https://via.placeholder.com/300x450';

                    favoriteItem.innerHTML = `
                        <img src="${imageUrl}" alt="${favoriteAnime.name}" class="favorite-anime-image">
                        <input type="text" value="${favoriteAnime.name}" id="anime-${favoriteAnime.id}" />
                        <button onclick="updateFavoriteName('${favoriteAnime.id}')">Atualizar Nome</button>
                    `;
                    favoriteList.appendChild(favoriteItem);
                });
            })
            .catch(error => {
                console.error('Erro ao carregar animes favoritos: ', error);
            });
    } else {
        console.log('Usuário não está autenticado.');
    }
}


// Função para atualizar o nome do anime favorito
function updateFavoriteName(animeId) {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const newName = document.getElementById(`anime-${animeId}`).value;

        db.collection('users').doc(userId).collection('favorites').doc(animeId).update({
            name: newName
        })
            .then(() => {
                alert('Nome do anime atualizado com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao atualizar nome do anime: ', error);
            });
    }
}

// Verificar se o usuário está autenticado e carregar o perfil e animes favoritos
auth.onAuthStateChanged(user => {
    if (user) {
        loadProfile();
        loadFavoriteAnimes();
        loadAnimes();
    } else {
        window.location.href = 'login.html'; // Redirecionar para a página de login se não estiver autenticado
    }
});

// Inicializar carregamento de animes ao carregar a página
document.addEventListener('DOMContentLoaded', loadAnimes);
