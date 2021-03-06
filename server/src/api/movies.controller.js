import MoviesDAO from "../dao/moviesDAO"

export default class MoviesController {
  static async apiGetMovies(req, res, next) {
    const MOVIES_PER_PAGE = 20
    const { moviesList, totalNumMovies } = await MoviesDAO.getMovies()
    const response = {
      movies: moviesList,
      page: 0,
      filters: {},
      entries_per_page: MOVIES_PER_PAGE,
      total_results: totalNumMovies,
    }
    res.json(response)
  }

  static async apiGetMoviesByCountry(req, res, next) {
    const countries = Array.isArray(req.query.countries)
      ? req.query.countries
      : Array(req.query.countries)
    const moviesList = await MoviesDAO.getMoviesByCountry(countries)
    const response = {
      titles: moviesList,
    }
    res.json(response)
  }

  static async apiGetMovieById(req, res, next) {
    try {
      const id = req.params.id || {}
      const movie = await MoviesDAO.getMovieByID(id)
      if (!movie) {
        res.status(404).json({ error: "Not found" })
        return
      }
      const updatedType = movie.lastupdated instanceof Date ? "Date" : "other"
      res.json({ movie, updatedType })
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiSearchMovies(req, res, next) {
    const MOVIES_PER_PAGE = 20
    let page
    try {
      page = req.query.page ? parseInt(req.query.page, 10) : 0
    } catch (e) {
      console.error(`Got bad value for page:, ${e}`)
      page = 0
    }
    let searchType
    try {
      searchType = Object.keys(req.query)[0]
    } catch (e) {
      console.error(`No search keys specified: ${e}`)
    }

    const filters = {}

    switch (searchType) {
      case "genre":
        filters.genre = req.query.genre
        break
      case "cast":
        filters.cast = req.query.cast
        break
      case "text":
        filters.text = req.query.text
        break
      default:
      // nothing to do
    }

    const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
      filters,
      page,
      MOVIES_PER_PAGE,
    })

    const response = {
      movies: moviesList,
      page,
      filters,
      entries_per_page: MOVIES_PER_PAGE,
      total_results: totalNumMovies,
    }

    res.json(response)
  }

  static async apiFacetedSearch(req, res, next) {
    const MOVIES_PER_PAGE = 20

    let page
    try {
      page = req.query.page ? parseInt(req.query.page, 10) : 0
    } catch (e) {
      console.error(`Got bad value for page, defaulting to 0: ${e}`)
      page = 0
    }

    if (!req.query.cast) {
      return this.apiSearchMovies(req, res, next)
    }

    const filters = { cast: req.query.cast }

    const facetedSearchResult = await MoviesDAO.facetedSearch({
      filters,
      page,
      MOVIES_PER_PAGE,
    })

    const response = {
      movies: facetedSearchResult.movies,
      facets: {
        runtime: facetedSearchResult.runtime,
        rating: facetedSearchResult.rating,
      },
      page,
      filters,
      entries_per_page: MOVIES_PER_PAGE,
      total_results: facetedSearchResult.count,
    }

    res.json(response)
  }

  static async getConfig(req, res, next) {
    const { poolSize, wtimeout, authInfo } = await MoviesDAO.getConfiguration()
    try {
      const response = {
        pool_size: poolSize,
        wtimeout,
        ...authInfo,
      }
      res.json(response)
    } catch (e) {
      res.status(500).json({ error: e })
    }
  }
}
