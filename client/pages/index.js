import Link from 'next/link'
import App from '../components/App'
import { withApollo } from '../lib/apollo'
import { useQuery, gql } from '@apollo/client'

export const GET_MOVIES = gql`
  query GetMovies {
    movies {
      _id
      title
      year
      rated
    }
  }
`

const IndexPage = () => {
  const { loading, error, data } = useQuery(GET_MOVIES)

  if (loading || !data) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  return (
    <App>
      <h1>Movies SSR</h1>
      <ul>
        {data?.movies.map(movie => (
          <li key={movie._id}>
            <Link href="/movie/[id]" as={`/movie/${movie._id}`}>
              <a>
                {movie.title} - {movie.year} - {movie.rated}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </App>
  )
}

export default withApollo({ ssr: true })(IndexPage)
