// ---> NEXT THING TO DO: https://github.com/expressjs/csurf
// TO DO: Use Helmet for app security
// TO DO: Consider how to implement forking

require('dotenv').config()
const path = require('path')
const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redis = require('redis')
const client = redis.createClient()
const { formWizard } = require('./form-wizard/form-wizard')
const { steps, fields } = require('./form')


// Consider https://github.com/i18next/i18next instead
// https://github.com/i18next/i18next-express-middleware
const i18n = require('i18n')

const app = express()
const PORT = 5000

// Session
// TO DO: throw error if session does not exist
// https://www.npmjs.com/package/connect-redis
app.use(session({
  store: new RedisStore(),
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  name: 'govukapp.sid',
}))

// Translations
i18n.configure({
  locales: ['en', 'es'],
  cookie: 'locale', // Change browser cookie to change language (e.g. locale=es)
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  queryParameter: 'lang', // Add ?lang=es to URL to change language
  objectNotation: true,
  updateFiles: false,
  syncFiles: false,
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(cookieParser())
app.use(i18n.init)

app.use('/assets', express.static(path.resolve('node_modules/govuk-frontend/assets')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))

nunjucks.configure([
  'src/views',
  'node_modules/govuk-frontend/',
  'node_modules/govuk-frontend/components/'
], {
  autoescape: true,
  express: app,
  noCache: true,
})

app.set('view engine', 'njk')

formWizard(app, steps, fields)

app.get('/', (req, res) => {
  res.render('index', {
    title: res.__('title'),
  })
})

app.get('/confirm', (req, res) => {
  res.render('confirm', {
    title: res.__('title'),
    applicant: {
      firstName: req.session.form.firstName,
      secondName: req.session.form.secondName,
      email: req.session.form.email,
    }
  })
})

app.get('/complete', (req, res) => {
  res.render('complete')
})

client.on('connect', function() {
  console.log('Redis client connected')
  app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
});

client.on('error', function (err) {
  console.log('Something went wrong:', err);
})
