const express = require('express')
const {
  initialiseSession,
  validateStep,
  validateFormData,
  saveFormData,
  renderView,
} = require('./middleware')

// const GETpipeline = [validateSession, validateStep, getValues, renderView]
// const POSTpipeline = [validateSession, processInput, validateInput, saveValues, renderView]

// TO DO: validate props for each form step
const createRoute = (router, steps, fields) => (step) =>
  router
    .route(step.path)
    .get(
      initialiseSession(steps),
      // validateStep(steps),
      // TO DO: Handle step pre GET behaviour
      // TO DO: clear any errors (might not be necessary if locals lifecycle is per request)
      renderView(steps, fields)
    )
    .post(
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
