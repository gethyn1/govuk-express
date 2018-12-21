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

// Consider https://github.com/i18next/i18next instead
// https://github.com/i18next/i18next-express-middleware
const i18n = require('i18n')

const app = express()
const PORT = 5000

// Session
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
  directory: __dirname + '/locales',
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

app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/assets')))
app.use('/assets', express.static(path.join(__dirname, '/assets')))

nunjucks.configure([
  'views',
  'node_modules/govuk-frontend/',
  'node_modules/govuk-frontend/components/'
], {
  autoescape: true,
  express: app,
  noCache: true,
})

app.set('view engine', 'njk')

app.get('/', (req, res) => {
  res.render('index', {
    title: res.__('title'),
  })
})

app.post('/', (req, res) => {
  console.log(req.body)
  if (!req.body.name) {
    return res.render('index', {
      title: res.__('title'),
      errorMessage: { text: 'Enter a name' },
    })
  }

  req.session.name = req.body.name
  res.redirect('confirm')
})

app.get('/confirm', (req, res) => {
  res.render('confirm', {
    title: res.__('title'),
    applicant: {
      name: req.session.name,
    }
  })
})

app.get('/complete', (req, res) => {
  console.log('>>>>>>', req.session.name)
  res.render('complete')
})

client.on('connect', function() {
  console.log('Redis client connected')
  app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
});

client.on('error', function (err) {
  console.log('Something went wrong ' + err);
})
