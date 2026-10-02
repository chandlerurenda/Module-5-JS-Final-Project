// http://www.omdbapi.com/?apikey=7974a547&
// http://img.omdbapi.com/?apikey=7974a547&

async function main(film) {
const films = await fetch("http://www.omdbapi.com/?apikey=7974a547&s=batman")
const filmsData = await films.json();
const filmEl = document.querySelector('.films');
console.log(filmsData)
filmEl.innerHTML = filmsData.Search
.map(data => `<div class="film">
    <figure class="film__img--wrapper">
        <img class="film__img" src="${data.Poster} alt="">
    </figure>
    <div class="film__title">${data.Title}</div>
    <div class="film__year">
        <img class="film__year--logo" src="./assets/calendar-days-solid-full.svg" alt="">
        <div class="film__year--number">${data.Year}</div>
    </div>
    <div class="media__type--logo">
        <img src="./assets/clapperboard-solid-full.svg" alt="">
         <div class="media__type">${data.Type}</div>
    </div>
    <div class="film__rating--number">${data.Rating}</div>   
    </div>
    <div class="film__duration">
        <div class="film__duration--logo"><img src="./assets/clock-regular-full.svg" alt=""></div>
        <div class="film__duration--number">2h 17m</div>
    </div>
</div>`)
        .join("");

    const details = await Promise.all(
  filmsData.Search.map(film =>
    fetch(`https://www.omdbapi.com/?apikey=7974a547&i=${film.imdbID}`)
      .then(res => res.json())
  )
);
}

main();