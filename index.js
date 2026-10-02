// http://www.omdbapi.com/?apikey=7974a547&
// http://img.omdbapi.com/?apikey=7974a547&

async function main(film) {
const films = await fetch("http://www.omdbapi.com/?apikey=7974a547&s=batman")
const filmsData = await films.json();
const filmEl = document.querySelector('.film');

filmEl.innerHTML = filmsData
.map(data => `<div class="film">
    <figure class="film__img--wrapper">
        <img class="film__img" src="./assets/dune_film_img.jpg" alt="">
    </figure>
    <div class="film__title">Dune</div>
    <div class="film__year">
        <img class="film__year--logo" src="./assets/calendar-days-solid-full.svg" alt="">
        <div class="film__year--number">1984</div>
    </div>
    <div class="film__rating">
    <div class="film__rating--logo">
        <img src="./assets/star-solid-full.svg" alt="">
    </div>
    <div class="film__rating--number">6.2/10</div>   
    </div>
    <div class="film__duration">
        <div class="film__duration--logo"><img src="./assets/clock-regular-full.svg" alt=""></div>
        <div class="film__duration--number">2h 17m</div>
    </div>
</div>
<div class="film">
    <figure class="film__img--wrapper">
        <img class="film__img" src="./assets/dune_film_img.jpg" alt="">
    </figure>
    <div class="film__title">Dune</div>
    <div class="film__year">
        <img class="film__year--logo" src="./assets/calendar-days-solid-full.svg" alt="">
        <div class="film__year--number">1984</div>
    </div>
    <div class="film__rating">
    <div class="film__rating--logo">
        <img src="./assets/star-solid-full.svg" alt="">
    </div>
    <div class="film__rating--number">6.2/10</div>   
    </div>
    <div class="film__duration">
        <div class="film__duration--logo"><img src="./assets/clock-regular-full.svg" alt=""></div>
        <div class="film__duration--number">2h 17m</div>
    </div>
</div>`)
        .join("");
}

main();