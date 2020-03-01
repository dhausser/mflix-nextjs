import express from "express"
import path from "path"
import bodyParser from "body-parser"
import cors from "cors"
import morgan from "morgan"
import movies from "../src/api/movies.route"
import users from "../src/api/users.route"

const app = express()

app.use(cors())
process.env.NODE_ENV !== "prod" && app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Register api routes
app.use("/api/v1/movies", movies)
app.use("/api/v1/user", users)
app.use(express.static(path.join(__dirname, "../../client/out")))
app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "../../client/out", "index.html"))
})

export default app
