const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');

if (menu && nav) {
  menu.onclick = () => {
    nav.classList.toggle('open');
  };
}
