const path = require('path')
const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

// Consider https://github.com/i18next/i18next instead
// https://github.com/i18next/i18next-express-middleware
const i18n = require('i18n')

const app = express()
const PORT = 5000

i18n.configure({
  locales: ['en','es'],
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
app.use(cookieParser())
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
      errorMessage: { text: 'Enter a name' },
    })
  }

  res.redirect('confirmation')
})

app.get('/confirmation', (req, res) => {
  res.render('confirmation')
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
