let body = document.querySelector('body')
let banner = document.getElementById('banner')

// Get the theme from localStorage or set it to 'light' if not found
let theme = localStorage.getItem('theme') || 'light';

// Set the initial theme
if (theme === 'dark') {
    body.classList.add('dark');
    banner.src = "../imagens/Prancheta 1.4.svg"
    banner.classList.add('dark_banner')
} else {
    banner.src = "../imagens/Prancheta 2.4.svg"
    banner.classList.remove('dark_banner') 
}


document.querySelector('.ball').addEventListener('click', (e)=>{
    e.target.classList.toggle('ball-move');
    e.target.classList.toggle('white-mode')
    body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        // code to execute if body has class 'dark'
        localStorage.setItem('theme', 'dark');
        banner.src = "../imagens/Prancheta 1.4.svg"
        banner.classList.add('dark_banner')

      } else {
        // code to execute if body does not have class 'dark'
        localStorage.setItem('theme', 'light');
        banner.src = "../imagens/Prancheta 2.4.svg"
        banner.classList.remove('dark_banner') 

      }
});
