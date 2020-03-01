import 'dotenv/config'
import express from "express"
import path from "path"
import cors from "cors"
import bodyParser from "body-parser"
import { ApolloServer, gql } from 'apollo-server-express'
import movies from "./api/movies.route"
import users from "./api/users.route"

import { typeDefs, resolvers } from  './schema'
import MoviesController from './api/movies.controller'
import CommentsController from './api/comments.controller'
import UsersController from './api/users.controller'
import MoviesDAO from './dao/moviesDAO'
import CommentsDAO from './dao/commentsDAO'
import UsersDAO from './dao/usersDAO'


export const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({ MoviesDAO, CommentsDAO, UsersDAO })
});

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Register api routes
app.use("/api/v1/movies", movies)
app.use("/api/v1/user", users)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../../client/out")))
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/out", "index.html"))
  })
}

server.applyMiddleware({ app });

export default app
