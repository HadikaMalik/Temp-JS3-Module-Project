// Level 300

async function getAllEpisodes(selectedShowId) {
  try {
    if (!state.episodesByShowId[selectedShowId]) {
      const response = await fetch(`https://api.tvmaze.com/shows/${selectedShowId}/episodes`);

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const episodes = await response.json();
      state.episodesByShowId[selectedShowId] = episodes;
      state.allEpisodes = episodes;
      return episodes;
    } else {
      return state.episodesByShowId[selectedShowId];
    }
  }
  catch (error) {
    handleFetchError(error);
    return [];
  }
}

async function getAllShows() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const shows = await response.json();
    state.allShows = shows;
    state.selectedShowId = shows[0].id
    return shows;
  } catch (error) {
    handleFetchError(error);

    return [];
  }
}

// Level 100 and a bit of 300 to make the function work

function setup() {
  getAllShows().then(() => {
    populateShowSelect();
  });
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  state.allEpisodes.forEach((episode) => {
    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("episode");

    const episodeTitle = document.createElement("h2");
    const episodeCode = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    episodeTitle.textContent = `${episode.name} - ${episodeCode}`;
    const seasonNumber = document.createElement("p");
    const episodeNumber = document.createElement("p");
    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image && episode.image.medium ? episode.image.medium : 'https://via.placeholder.com/150'; // Use a placeholder image URL or handle it based on your requirements
    episodeImage.alt = episode.name;
    const episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episode.summary;
    const episodeOption = document.createElement("option");
    episodeOption.value = episode.id;
    episodeOption.text = `${episodeCode} - ${episode.name}`;
    dropDownMenuForEpisode.appendChild(episodeOption);
    episodeDiv.id = `episode - ${episode.id}`;

    episodeDiv.appendChild(episodeTitle);
    episodeDiv.appendChild(seasonNumber);
    episodeDiv.appendChild(episodeNumber);
    episodeDiv.appendChild(episodeImage);
    episodeDiv.appendChild(episodeSummary);

    rootElem.appendChild(episodeDiv);
  });
}

// level 200 

const state = {
  allEpisodes: [],
  allShows: [],  // Add an empty array for shows
  selectedShowId: "",  // Keep track of the selected show
  searchTerm: "",
  episodesByShowId: {},
};

function render() {
  const filteredEpisodes = state.allEpisodes.filter(function (episode) {
    return episode.name.toLowerCase().includes(state.searchTerm.toLowerCase()) || episode.summary.toLowerCase().includes(state.searchTerm.toLowerCase());
  });

  makePageForEpisodes(filteredEpisodes);

  document.getElementById("search-info").textContent = `Displaying ${filteredEpisodes.length} / ${filteredEpisodes.length}`;
};

const episodeInput = document.querySelector("#q");

episodeInput.addEventListener("input", function () {
  state.searchTerm = episodeInput.value.toLowerCase();
  render();
});

//function for drop down menu for select a show
function populateShowSelect() {
  const showSelectElement = document.getElementById("show-select");

  showSelectElement.addEventListener("change", async function () {
    const selectedValueForShow = showSelectElement.value;

    state.allEpisodes = [];
    dropDownMenuForEpisode.innerHTML = "";

    if (selectedValueForShow === "all") {
      render(state.allEpisodes);
    }
    else {
      const episodes = await getAllEpisodes(selectedValueForShow);
      render(episodes);
    }
  });

  // sorting show list in alphabetical order
  state.allShows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  state.allShows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.text = show.name;
    showSelectElement.appendChild(option);
  });
}

//function for drop down menu for select your episode 
const dropDownMenuForEpisode = document.getElementById("select");
dropDownMenuForEpisode.addEventListener("change", function () {
  const selectedValueForEpisode = dropDownMenuForEpisode.value;

  if (selectedValueForEpisode === "all") {
    render(state.allEpisodes);
  }
  else {
    const selectedEpisode = state.allEpisodes.find((episode) => episode.id === parseInt(selectedValueForEpisode));
    render([selectedEpisode]);
    navigateToEpisode(selectedEpisode);
  }
});

//function to scroll to specific episode on page
function navigateToEpisode(episode) {
  if (episode) {
    const episodeElement = document.getElementById(`episode - ${episode.id}`);

    if (episodeElement) {
      episodeElement.scrollIntoView({ behavior: "smooth" });
    }
  }
}

window.onload = setup;

