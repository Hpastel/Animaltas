const auth = firebase.auth();

// Login function
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('User logged in:', user);
            window.location.href = '../index.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessageText = error.message;
            errorMessage.textContent = `Error: ${errorMessageText}`;
        });
});

// Adicione validação para limpar mensagens de erro quando o usuário interage com o formulário
loginForm.addEventListener('input', () => {
    errorMessage.textContent = ''; // Limpa a mensagem de erro ao digitar no formulário
});
