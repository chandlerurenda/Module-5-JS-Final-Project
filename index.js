// http://www.omdbapi.com/?apikey=7974a547&
// http://img.omdbapi.com/?apikey=7974a547&

async function main(film) {
const films = await fetch("http://www.omdbapi.com/?apikey=7974a547&s=batman")
const filmsData = await films.json();
console.log(filmsData)

}
main()