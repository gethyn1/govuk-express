const express = require('express')
const {
  initFormWizardSession,
  validateRequestedStep,
  validateFormData,
  saveDataToSession,
  renderView,
} = require('./middleware')

// TO DO: validate props for each form step
const createRoute = (wizard, steps, fields) => (step) =>
  wizard
    .route(step.path)
    .get(
      initFormWizardSession(steps),
      validateRequestedStep(steps),
      // TO DO: Handle step pre GET behaviour
      // TO DO: clear any errors (might not be necessary if locals lifecycle is per request)
      renderView(steps, fields)
    )
    .post(
      // TO DO: Validate form input
      validateFormData(steps, fields),
      // TO DO: Handle step POST behaviour
      // TO DO: Set page errors
      saveDataToSession(steps),
      renderView(steps, fields)
    )

const formWizard = (app, steps, fields) => {
  const wizard = express.Router()
  steps.forEach(createRoute(wizard, steps, fields))
  app.use(wizard)
}

module.exports = { formWizard }
