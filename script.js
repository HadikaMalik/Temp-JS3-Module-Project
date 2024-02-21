//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  state.allEpisodes = allEpisodes;
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

// level 200 

const state = {
  allEpisodes: [],
  searchTerm: ""
};

function render() {
  const filteredEpisodes = state.allEpisodes.filter(function (episode) {
    return episode.name.toLowerCase().includes(state.searchTerm.toLowerCase()) || episode.summary.toLowerCase().includes(state.searchTerm.toLowerCase());
  });

  makePageForEpisodes(filteredEpisodes);

  document.getElementById("search-info").textContent = `Displaying ${filteredEpisodes.length} / 73 episodes`;
};

const input = document.querySelector("#q");

input.addEventListener("input", function () {
  state.searchTerm = input.value.toLowerCase();
  render();
});

const dropDownMenu = document.getElementById("select");
dropDownMenu.addEventListener("change", function () {
  const selectedValue = dropDownMenu.value;

  if (selectedValue === "all") {
    render(state.allEpisodes);
  }
  else {
    const selectedEpisode = state.allEpisodes.find((episode) => episode.id === parseInt(selectedValue));
    render([selectedEpisode]);
    navigateToEpisode(selectedEpisode);
  }
});

function navigateToEpisode(episode) {
  if (episode) {
    const episodeElement = document.getElementById(`episode - ${episode.id}`);

    if (episodeElement) {
      episodeElement.scrollIntoView({behavior: "smooth"});
    }
  }
}


window.onload = setup;
