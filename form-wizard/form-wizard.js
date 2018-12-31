const express = require('express')
const {
  initFormWizardSession,
  validateRequestedStep,
  saveDataToSession,
  renderView,
} = require('./middleware')

// TO DO: validate props for each form step
const createRoute = (wizard, steps) => (step) =>
  wizard
    .route(step.path)
    .get(
      initFormWizardSession(steps),
      validateRequestedStep(steps),
      // TO DO: Handle step pre GET behaviour
      // TO DO: clear any errors (might not be necessary if locals lifecycle is per request)
      renderView(steps)
    )
    .post(
      // TO DO: Validate form input
      // TO DO: Handle step POST behaviour
      // TO DO: Set page errors
      saveDataToSession(steps),
      renderView(steps)
    )

const formWizard = (app, steps) => {
  const wizard = express.Router()
  steps.forEach(createRoute(wizard, steps))
  app.use(wizard)
}

module.exports = { formWizard }
