// Level 300

async function getAllEpisodes() {
  if (state.allEpisodes.length === 0) {
    try {
      const response = await fetch("https://api.tvmaze.com/shows/82/episodes");

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const episodes = await response.json();
      state.allEpisodes = episodes;
      return episodes;
    } catch (error) {
      handleFetchError(error);
      return [];
    }
  } else {
    return state.allEpisodes;
  }
}

async function getAllShows() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const shows = await response.json();
    return shows;
  } catch (error) {
    handleFetchError(error);
    return [];
  }
}

function populateShowSelect(shows) {
  const showSelectElement = document.getElementById("show-select");

  shows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.text = show.name;
    showSelectElement.appendChild(option);
  });
}

// Level 100 and a bit of 300 to make the function work

function setup() {
  Promise.all([getAllEpisodes(), getAllShows()]).then(([allEpisodes, allShows]) => {
    makePageForEpisodes(allEpisodes);
    populateShowSelect(allShows);
  });
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("episode");

    const episodeTitle = document.createElement("h2");
    const episodeCode = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    episodeTitle.textContent = `${episode.name} - ${episodeCode}`;
    const seasonNumber = document.createElement("p");
    const episodeNumber = document.createElement("p");
    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image.medium;
    episodeImage.alt = episode.name;
    const episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episode.summary;
    const episodeOption = document.createElement("option");
    episodeOption.value = episode.id;
    episodeOption.text = `${episodeCode} - ${episode.name}`;
    dropDownMenu.appendChild(episodeOption);
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
      episodeElement.scrollIntoView({ behavior: "smooth" });
    }
  }
}

window.onload = setup;

