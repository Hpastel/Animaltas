const auth = firebase.auth();

// Função para carregar o perfil do usuário e os animes favoritos
function loadProfileAndFavorites() {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;

    // Carregar informações do perfil do usuário
    db.collection("users")
      .doc(userId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          document.getElementById("userName").value = userData.name || "";
          document.getElementById("userEmail").value = userData.email || "";
          document.getElementById("userBio").value = userData.bio || "";
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

    // Carregar animes favoritos do usuário
    const favoritesRef = firebase
      .database()
      .ref("users/" + userId + "/favorites");
    favoritesRef
      .once("value")
      .then((snapshot) => {
        const favoriteList = document.getElementById("favoriteList");
        if (snapshot.exists()) {
          favoriteList.innerHTML = ""; // Limpar lista de favoritos

          snapshot.forEach((childSnapshot) => {
            const favoriteAnime = childSnapshot.val();
            const favoriteItem = document.createElement("div");
            favoriteItem.className = "favorite-item";

            // Verifica se a URL da imagem está disponível
            const imageUrl = favoriteAnime.imageUrl
              ? favoriteAnime.imageUrl
              : "https://via.placeholder.com/300x450";

            // Criar elemento de imagem
            const animeImage = document.createElement("img");
            animeImage.src = imageUrl;
            animeImage.alt = favoriteAnime.title;
            animeImage.className = "favorite-anime-image";
            // Adicionar evento de clique na imagem do anime
            animeImage.addEventListener("click", () => {
              // Redirecionar para a página de detalhes do anime usando o ID do anime
              const animeId = favoriteAnime.id;
              window.location.href = `detalhes_anime.html?id=${animeId}`;
            });
            favoriteItem.appendChild(animeImage);

            // Criar elemento de texto com nome do anime
            const animeName = document.createElement("span");
            animeName.innerText = favoriteAnime.title;
            favoriteItem.appendChild(animeName);

            // Criar botão para alterar nome do anime
            const changeNameBtn = document.createElement("button");
            changeNameBtn.innerText = "Alterar Nome";
            changeNameBtn.className = "btn btn-primary";
            changeNameBtn.onclick = () => changeAnimeName(childSnapshot.key);
            favoriteItem.appendChild(changeNameBtn);

            favoriteList.appendChild(favoriteItem);
          });
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar animes favoritos: ", error);
      });
  } else {
    console.log("No user is signed in.");
  }
}

// Função para atualizar as informações do perfil do usuário na Firestore
function updateProfileInfo(name, bio) {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;

    db.collection("users")
      .doc(userId)
      .update({
        name: name,
        bio: bio,
      })
      .then(() => {
        console.log("Perfil atualizado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar perfil:", error);
      });
  }
}

// Função para alterar o nome do anime favorito no Realtime Database
function changeAnimeName(animeId) {
  const newName = prompt("Digite o novo nome para o anime:");
  if (newName !== null) {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const favoriteRef = firebase
        .database()
        .ref("users/" + userId + "/favorites/" + animeId);

      favoriteRef
        .update({
          title: newName,
        })
        .then(() => {
          console.log("Nome do anime atualizado com sucesso!");
          // Recarregar a lista de favoritos após a atualização
          loadProfileAndFavorites();
        })
        .catch((error) => {
          console.error("Erro ao atualizar nome do anime:", error);
        });
    } else {
      console.log("No user is signed in.");
    }
  }
}

// Verificar se o usuário está autenticado e carregar o perfil e animes favoritos
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // O usuário está autenticado, execute o código relevante aqui
    loadProfileAndFavorites();
  } else {
    // O usuário não está autenticado, execute o código relevante aqui
    console.log("No user is signed in.");
  }
});
