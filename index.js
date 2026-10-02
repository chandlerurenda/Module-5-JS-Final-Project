// http://www.omdbapi.com/?apikey=7974a547&
// http://img.omdbapi.com/?apikey=7974a547&

async function main() {
  const searchBar = document.querySelector(".search__input");
  const submitBtn = document.querySelector(".submit__Btn");
  const films = await fetch("http://www.omdbapi.com/?apikey=7974a547&s=batman");
  const filmEl = document.querySelector(".films");

  submitBtn.addEventListener('click',() => {
    const currentText = searchBar.value;
    console.log(currentText)
    await fetchFilms(currentText)
  })
  async function fetchFilms(query) {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=7974a547&s=${query}`,
    );
    const filmsData = await response.json();

    if (filmsData.Response === "True") {
      const details = await Promise.all(
        filmsData.Search.map((film) =>
          fetch(
            `https://www.omdbapi.com/?apikey=7974a547&i=${film.imdbID}`,
          ).then((res) => res.json()),
        ),
      );

      filmEl.innerHTML = details
        .map((data) => {
          const runtime = parseInt(data.runtime);
          return `<div class="film">
          <figure class="film__img--wrapper">
            <img class="film__img" src="${data.Poster}" alt="" />
          </figure>
          <div class="film__title">${data.Title}</div>
          <div class="film__year">
            <img
              class="film__year--logo"
              src="./assets/calendar-days-solid-full.svg"
              alt=""
            />
            <div class="film__year--number">${data.Year}</div>
          </div>
          <div class="media__type--wrapper">
            <div class="media__type--logo">
              <img src="./assets/clapperboard-solid-full.svg" alt="" />
            </div>
            <div class="media__type">${data.Type}</div>
          </div>
          <div class="film__rating--wrapper">
            <div class="film__rating--logo">
              <img src="./assets/star-solid-full.svg" alt="" />
            </div>
            <div class="film__rating--number">${data.imdbRating}/10</div>
            <!-- Closing tag fixed here -->
          </div>
          <div class="film__duration">
            <div class="film__duration--logo">
              <img src="./assets/clock-regular-full.svg" alt="" />
            </div>
            <div class="film__duration--number">${data.Runtime}</div>
          </div>
        </div>`;
        })
        .join("");
      const runtimeSlider = document.querySelector(".runtime__slider");

      runtimeSlider.addEventListener("input", (event) => {
        const selectedRuntime = parseInt(event.target.value);
        const filteredFilms = details.filter(
          (data) => parseInt(data.Runtime) <= selectedRuntime,
        );
        filmEl.innerHTML = filteredFilms
          .map(
            (data) =>
              `<div class="film">
          <figure class="film__img--wrapper">
            <img class="film__img" src="${data.Poster}" alt="" />
          </figure>
          <div class="film__title">${data.Title}</div>
          <div class="film__year">
            <img
              class="film__year--logo"
              src="./assets/calendar-days-solid-full.svg"
              alt=""
            />
            <div class="film__year--number">${data.Year}</div>
          </div>
          <div class="media__type--wrapper">
            <div class="media__type--logo">
              <img src="./assets/clapperboard-solid-full.svg" alt="" />
            </div>
            <div class="media__type">${data.Type}</div>
          </div>
          <div class="film__rating--wrapper">
            <div class="film__rating--logo">
              <img src="./assets/star-solid-full.svg" alt="" />
            </div>
            <div class="film__rating--number">${data.imdbRating}/10</div>
            <!-- Closing tag fixed here -->
          </div>
          <div class="film__duration">
            <div class="film__duration--logo">
              <img src="./assets/clock-regular-full.svg" alt="" />
            </div>
            <div class="film__duration--number">${data.Runtime}</div>
          </div>
        </div>`,
          )
          .join("");
      });
    } else {
      filmEl.innerHTML = `<p>${filmsData.Error}<p>`;
    }
  }
}

main();
