/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.

  const data = await fetch(`http://api.tvmaze.com/search/shows?q=${query}`)
    .then(resp => {
      if (!resp.ok) throw new Error("Error! Status:", resp.status);
      return resp.json();
    })
    .then(data => data.map(({ show }) => {
      return {
        id: show.id,
        name: show.name,
        summary: show.summary,
        image: (show.image) ? show.image.original || show.image.medium : 'https://tinyurl.com/tv-missing'
      };
    }));

  return data;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button data-id="${show.id}">Episodes</button>
           </div>
         </div>
       </div>
      `);
    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above

  const data = await fetch(`http://api.tvmaze.com/shows/${id}/episodes`)
    .then(resp => {
      if (!resp.ok) throw new Error('ERROR! Status', resp.status);
      return resp.json();
    })
    .then(data => data.map(ep => {
      return {
        id: ep.id,
        name: ep.name,
        season: ep.season,
        number: ep.number
      };
    }));
  return data;
}


function populateEpisodes(eps) {
  const epList = document.getElementById('episodes-list');
  let listItems = '';
  for (let ep of eps) {
    listItems += `<li>${ep.name} (season ${ep.season}, number ${ep.number})</li>`;
  }
  epList.innerHTML = listItems;
  const epArea = document.getElementById('episodes-area').style.display = '';
}



const showList = document.getElementById('shows-list'); 
showList.addEventListener('click', async ({target})=>{
  if(target.tagName === 'BUTTON'){
    const id = target.getAttribute('data-id');
    const eps = await getEpisodes(id);
    populateEpisodes(eps);
  }

});