// // http://www.omdbapi.com/?apikey=7974a547&
// // http://img.omdbapi.com/?apikey=7974a547&

function setLoading(loading) {
  const loadingEl = document.querySelector(".films__loading");
  const filmsEl = document.querySelector(".films");
 
  if (loading) {
    loadingEl.classList.add("films__loading--show");
    filmsEl.classList.add("films__hide");
  } else {
    loadingEl.classList.remove("films__loading--show");
    filmsEl.classList.remove("films__hide");
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
        renderErrorMessage("Sorry, no films matched your search criteria. Please try again!")
      }
    } catch (error) {
      filmEl.innerHTML = `<p class="error-message">Something went wrong. Please try again</p>`;
    } finally {
      setLoading(false);
    }
  
    const filmElements = document.querySelectorAll('.film');
   filmElements.forEach((film, index) => {
          film.classList.add("show")
          film.style.transitionDelay = `${index * .2}s`
          film.classList.add("film");
          setTimeout(() => {
            film.style.opacity = 1;
          }, index * 200)
      });
    }


    function renderErrorMessage(message) {
      filmEl.innerHTML = `<p class="error-message">${message}</p>`;
    }
    
  function renderFilms(filmList) {

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
        </div>`
      })
      .join("");
     
       
  }
  fetchFilms("Dune");


}



main();
