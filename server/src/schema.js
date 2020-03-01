import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  scalar Date

  type Movie {
    _id: ID!
    title: String!
    plot: String!
    fullplot: String!
    year: Int!
    released: Date!
    lastupdated: Date!
    type: String!
    writers: [String]!
    languages: [String]!
    metacritic: Int!
    rated: String!
    genres: [String]!
    poster: String!
    countries: [String]!
    cast: [String]!
    runtime: Int!
    directors: [String]!
    num_mflix_comments: Int
    awards: Award
    tomatoes: Tomatoes
  }

  type Award {
    wins: Int!
    nominations: Int!
    text: String!
  }

  type Tomatoes {
    website: String!
    dvd: Date!
    boxOffice: String!
    consensus: String!
    production: String!
    lastUpdated: Date!
    fresh: Int!
    rotten: Int!
  }

  type Query {
    movies: [Movie]
  }
`;

export const resolvers = {
  Query: {
    movies: async (_ , __, { dataSources }) => {
      const { moviesList } = await dataSources.MoviesDAO.getMovies()
      return moviesList
    },
  },
};