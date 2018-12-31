const { getStepByPath } = require('./get-step-by-path')
const { stateMachine } = require('../state-machine')

const validateStep = (steps) => (req, res, next) => {
  const step = getStepByPath(req.url, steps)

  const requestedPathIsValid = stateMachine.dispatch(
    'validateStep',
    req.session.formWizardState,
    req.url,
    req.session.form.activePath
  )

  // Redirect if invalid path requested
  if (!requestedPathIsValid) {
    return res.redirect(req.session.form.activePath)
  }

  return next()
}

module.exports = {
  validateStep,
}
