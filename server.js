import express from 'express'
import { engine } from 'express-handlebars'
import session from 'express-session'

import { router as detailsRouter } from './routes/detailsRoutes.js'
import { router as userRouter } from './routes/userRoutes.js'
import { router as indexRouter } from './routes/indexRoutes.js'
import { router as apiRouter } from './routes/apiRoutes.js'
import { router as authRouter } from './routes/authRoutes.js'
import { authenticationMW, globalVariablesMW } from './config/globalMiddleware.js'

const app = express()
const port = process.env.PORT || 3000

// Handlebars
app.engine('hbs', engine({
  extname: ".hbs",
  helpers: {
    eq: (a, b, c) => a===b || a===c,
    mt: (a, b) => a > b,
    ifexists: (a, b) => a?? b,
    localDate: (d) => new Date(d).toLocaleDateString(),
    isoDate: (d) => new Date(d).toISOString().slice(0,10)
  }
}))
app.set("view engine", 'hbs')

// Static folder
app.use(express.static("public"))
app.use(express.urlencoded({extended: false}))

// Middleware for reading json body from post requests
app.use(express.json())

// Session configuration
app.use( session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: "rentACar",
  cookie: {
      maxAge: 20 * 60e3 // 20mims
  }
}))

// Check Authentication and set global variables for all pages
app.use(authenticationMW, globalVariablesMW)

// Routers
app.use(indexRouter)
app.use("/vehicle", detailsRouter)
app.use("/user", userRouter)
app.use("/api", apiRouter)
app.use("/auth", authRouter)

// Redirect any other route
app.use((req, res) => {
  res.redirect("/")
})

// Error Handling / Handle all next(error)
app.use((err, req, res, next) => {
  console.error("Error:", err.message)
  res.render("error", {message: err.message})
})

app.listen(port, () => {
  console.log(`Express app listening on  http://localhost:${port}/`)
})
