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

const canvas = document.getElementById('starry-bg');
const ctx = canvas.getContext('2d');

let stars = [];
let shootingStars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}

// Generate stars
function initStars() {
  stars = [];
  const count = Math.floor((canvas.width * canvas.height) / 3000); // Scale with screen size
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      twinkleDir: Math.random() < 0.5 ? 1 : -1
    });
  }
}

// Draw Gradient Background & Stars
function drawBackground() {
  // Deep space radial gradient
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
  );
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(0.5, '#090d16');
  gradient.addColorStop(1, '#020408');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateAndDrawStars() {
  stars.forEach(star => {
    // Twinkle effect
    star.alpha += star.speed * star.twinkleDir;
    if (star.alpha >= 1) {
      star.alpha = 1;
      star.twinkleDir = -1;
    } else if (star.alpha <= 0.2) {
      star.alpha = 0.2;
      star.twinkleDir = 1;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.shadowBlur = star.radius * 2;
    ctx.shadowColor = '#ffffff';
    ctx.fill();
    ctx.shadowBlur = 0; // Reset blur for performance
  });
}

// Spawn occasional Shooting Stars
function handleShootingStars() {
  if (Math.random() < 0.015 && shootingStars.length < 3) {
    shootingStars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height / 2),
      length: Math.random() * 80 + 40,
      speed: Math.random() * 10 + 6,
      angle: Math.PI / 4, // 45 degrees
      opacity: 1
    });
  }

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let s = shootingStars[i];
    
    let endX = s.x - Math.cos(s.angle) * s.length;
    let endY = s.y - Math.sin(s.angle) * s.length;

    let grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
    grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;
    s.opacity -= 0.01;

    if (s.opacity <= 0 || s.x > canvas.width || s.y > canvas.height) {
      shootingStars.splice(i, 1);
    }
  }
}

// Main Animation Loop
function animate() {
  drawBackground();
  updateAndDrawStars();
  handleShootingStars();
  requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('resize', resizeCanvas);

// Initialize
resizeCanvas();
animate();

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
