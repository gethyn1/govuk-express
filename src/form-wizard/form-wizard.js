const express = require('express')
const csrf = require('csurf')
const {
  initialiseSession,
  validateStep,
  validateFormData,
  saveFormData,
  renderView,
} = require('./middleware')

// CSRF
// TO DO: understand csurf cookie settings
const csrfProtection = csrf()

// const GETpipeline = [validateSession, validateStep, getValues, renderView]
// const POSTpipeline = [validateSession, processInput, validateInput, saveValues, renderView]

// TO DO: validate props for each form step
const createRoute = (router, steps, fields) => (step) =>
  router
    .route(step.path)
    .get(
      csrfProtection,
      initialiseSession(steps),
      // validateStep(steps),
      // TO DO: Handle step pre GET behaviour
      // TO DO: clear any errors (might not be necessary if locals lifecycle is per request)
      renderView(steps, fields)
    )
    .post(
      csrfProtection,
      // TO DO: format user input e.g. ['trim', 'singlespaces', 'hyphens']
      validateFormData(steps, fields),
      // TO DO: Handle step POST behaviour
      // TO DO: Set page errors
      saveFormData(steps),
      renderView(steps, fields)
    )

const formWizard = (app, steps, fields) => {
  const wizard = express.Router()
  steps.forEach(createRoute(wizard, steps, fields))
  app.use(wizard)
}

module.exports = { formWizard }
