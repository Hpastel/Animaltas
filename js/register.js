
const auth = firebase.auth();


document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const error_message = document.getElementById('error')

    if (name.trim() === '') {
        error_message.textContent = ('Nome: Introduz um nome valido');
        return;
    }else if(name.trim().lenght < 3){
        error_message.textContent = ('Nome: Minimo 3 caracteres no nome');
    }else{
        error_message.textContent = '';
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        error_message.textContent = ('Email: Introduz um email');
        return;
    }else{
        error_message.textContent = '';
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        error_message.textContent = ('Password: Minimo 8 caracteres, um numero, uma letra maiusculo, uma letra minuscula');
        return;
    }else{
        error_message.textContent = '';
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return db.collection('users').doc(user.uid).set({
                name: name,
                email: email,
                bio: ''
            });
        })
        .then(() => {
            window.location.href = '../index.html';
        })
        .catch((error) => {
            console.error('Error registering user: ', error);
        });
});