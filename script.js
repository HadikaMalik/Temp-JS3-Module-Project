//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  episodeList.map(({ name, season, number, image, summary }, index) => {
    const card = document.getElementById("film-card").content.cloneNode(true);
    card.querySelector("h3").textContent = `${name} -`;
    card.querySelector("#season-number").textContent = `S${padNumbers(season)}E${padNumbers(number)}`;
    card.querySelector("#medium-img").src = image.medium;
    card.querySelector("#summary").innerHTML = summary;
    rootElem.append(card);
    // console.log("in map", image);
  })
}

function padNumbers(num) {
  return String(num).padStart(2, '0');
}

window.onload = setup;
