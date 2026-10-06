// // http://www.omdbapi.com/?apikey=7974a547&
// // http://img.omdbapi.com/?apikey=7974a547&

function setLoading(loading) {
  const loadingEl = document.querySelector(".films__loading");
  const filmsEl = document.querySelector(".films");
  filmsEl.classList.remove(".films")

  if (loading) {
    loadingEl.classList.add("films__loading--show");
  } else {
    loadingEl.classList.remove("films__loading--show");
  }
}

async function main() {
  const searchBar = document.querySelector(".search__input");
  const searchForm = document.querySelector(".searchForm");
  const filmEl = document.querySelector(".films");

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const currentText = searchBar.value.trim();
    if (currentText) {
      await fetchFilms(currentText);
    }
  });

  async function fetchFilms(query) {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch(
        `https://www.omdbapi.com/?apikey=7974a547&s=${query}`
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

        renderFilms(details);

        const runtimeSlider = document.querySelector(".runtime__slider");
        if (runtimeSlider) {
        runtimeSlider.oninput = (event) => {
          const selectedRuntime = parseInt(event.target.value, 10);
          const filteredFilms = details.filter((data) => {
            const filmRuntime = parseInt(data.Runtime, 10) || 0;
            return filmRuntime <= selectedRuntime;
          });
          renderFilms(filteredFilms);
        };
      }
      } else {
        filmEl.innerHTML = `<p class = "error-msg">${filmsData.Error}</p>`;
      }
    } catch (error) {
      filmEl.innerHTML = `<p class="error-msg">Something Went wrong. Please Try again</p>`;
    } finally {
      setLoading(false);
    }
  }

  function renderFilms(filmList) {
    if (!filmList || !filmList.length) {
      filmEl.innerHTML = `<p>No films match your search/filter criteria</p>`;
      return;
    }

    filmEl.innerHTML = filmList
      .map((data) => {
        
        return `<div class="film">
          <figure class="film__img--wrapper">
            <img class="film__img" src="${data.Poster}";
          </figure>
          <div class="film__title">${data.Title}</div>
          <div class="film__year">
            <img class="film__year--logo"
              src="./assets/calendar-days-solid-full.svg" alt=""/>
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
  }
  fetchFilms("Dune");
}


main();
