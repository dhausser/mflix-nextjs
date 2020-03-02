import { useRouter } from 'next/router'
import { useQuery, gql } from '@apollo/client'
import { withApollo } from '../../lib/apollo'
import App from '../../components/App'

export const GET_MOVIE_BY_ID = gql`
  query GetMovieById($id: ID!) {
    movie(id: $id) {
      _id
      title
      year
      runtime
      metacritic
      poster
    }
  }
`

const Movie = () => {
  const router = useRouter()
  const { id } = router.query
  const { loading, error, data } = useQuery(GET_MOVIE_BY_ID, {
    variables: { id },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  const { title, year, runtime, metacritic, poster } = data?.movie

  return (
    <App>
      <h2>{title}</h2>
      <img src={poster} alt={`${title} movie poster`} width="300" />
      <p>Year: {year}</p>
      <p>Runtime: {runtime}</p>
      <p>Metacritic: {metacritic}</p>
    </App>
  )
}

export default withApollo()(Movie)
