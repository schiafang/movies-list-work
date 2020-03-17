(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const dataPanel = document.getElementById('data-panel')
  let paginationData = []

  // 右上切換清單與卡片模式
  const displayModeSwitch = document.getElementById('display-mode')

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    getTotalPages(data)
    getPageData(1, data)
  }).catch((err) => console.log(err))

  //----------------- Listener ----------------- //
  // listen to data-panel show movieDetail and addFavorite
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

  // listen to search-form submit event'
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let input = searchInput.value.toLowerCase()
    let results = data.filter(
      movie => movie.title.toLowerCase().includes(input)
    )
    getTotalPages(results)
    getPageData(1, results)
  })

  // listen to pagination <a>
  pagination.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      console.log(event.target.dataset)
      getPageData(event.target.dataset.page)
    }
  })

  // listen to switch-display-mode 
  displayModeSwitch.addEventListener('click', (event) => {
    if (event.target.matches('.fa-th')) {
      getPageData(1, data)
    } else if (event.target.matches('.fa-bars')) {
      getListPageData(1, data)
    }
  })

  //----------------- Function ----------------- //
  // display card-mode
  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h5>
            </div>            
            <div class="card-footer">
              <!-- "More" button -->
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  // display list-mode
  function listMode(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += ` 
       <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">${item.title}
          <button class="btn btn-primary btn-show-movie ml-auto" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>&nbsp;
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
        `
    })
    dataPanel.innerHTML = htmlContent
  }

  // show movie detail in modal
  function showMovie(id) {
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')
    const url = INDEX_URL + id

    axios.get(url).then(response => {
      const data = response.data.results

      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  // add favorite movie
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))
    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  // caculate tatal page
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  // show card-mode data by page
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  // show list-mode data by page
  function getListPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    listMode(pageData)
  }

})()