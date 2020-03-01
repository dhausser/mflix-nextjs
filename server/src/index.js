import 'dotenv/config'
import { MongoClient } from "mongodb"
import app, { server } from "./server"
import MoviesDAO from "./dao/moviesDAO"
import UsersDAO from "./dao/usersDAO"
import CommentsDAO from "./dao/commentsDAO"

MongoClient.connect(
  process.env.MFLIX_DB_URI,
  {
    poolSize: 50,
    wtimeout: 2500,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    await MoviesDAO.injectDB(client)
    await UsersDAO.injectDB(client)
    await CommentsDAO.injectDB(client)
    app.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    ) 
  })
