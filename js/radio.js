document.addEventListener('DOMContentLoaded', function () {
    // Verificar se o player de rádio já está adicionado
    if (!document.getElementById('radio-player')) {
        // Criar o elemento de rádio
        var radioDiv = document.createElement('div');
        radioDiv.classList.add('radio-news');
        radioDiv.innerHTML = `
            <li class="nothing">
                <iframe id="radio-player" class="radio" src="https://tunein.com/embed/player/s287770/" scrolling="no"></iframe>
            </li>
        `;

        // Adicionar o player ao corpo do documento
        document.body.appendChild(radioDiv);
    }
});
