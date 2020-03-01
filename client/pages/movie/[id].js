import { useRouter } from 'next/router'
import useSWR from 'swr'
import { fetcher } from '..'

const Movie = () => {
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR(`/movies/id/${id}`, fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  const { title, year, runtime, cast, metacritic, poster } = data.movie

  return (
    <div>
      <ul>
        <li><p>{title}</p></li>
        <li><p>{year}</p></li>
        <li><p>{runtime}</p></li>
        <li><p>{cast[0]}</p></li>
        <li><p>{metacritic}</p></li>
      </ul>
      <img src={poster} alt="movie poster"/>
    </div>
  )
}

export default Movie
