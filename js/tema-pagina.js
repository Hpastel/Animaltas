let body = document.querySelector('body')
let banner = document.getElementById('banner')
let news = document.getElementById('news')


let theme = localStorage.getItem('theme') || 'light';
if (theme === 'dark') {
  body.classList.add('dark');
  banner.src = "imagens/Prancheta 1.4.svg"
  banner.classList.add('dark_banner')
  news.classList.add('dark_news')
} else {
  banner.src = "imagens/Prancheta 2.4.svg"
  banner.classList.remove('dark_banner') 
  news.classList.remove('dark_news')
}

document.querySelector('.ball').addEventListener('click', (e)=>{
    e.target.classList.toggle('ball-move');
    e.target.classList.toggle('white-mode')
    body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        // code to execute if body has class 'dark'
        localStorage.setItem('theme', 'dark');
        banner.src = "imagens/Prancheta 1.4.svg"
        banner.classList.add('dark_banner')
        news.classList.add('dark_news')
    
      } else {
        // code to execute if body does not have class 'dark'
        localStorage.setItem('theme', 'light');
        banner.src = "imagens/Prancheta 2.4.svg"
        banner.classList.remove('dark_banner') 
        news.classList.remove('dark_news')
    
      }
});
