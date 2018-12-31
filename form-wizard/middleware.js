const { find, propEq } = require('ramda')
const stateMachine = require('./state-machine')

const getStepByPath = path => find(propEq('path', path))

const initFormWizardSession = (steps) => (req, res, next) => {
  req.session.form = req.session.form || {}
  req.session.formWizardState = req.session.formWizardState || 'IN_PROGRESS'
  // Set allowed form step, default to first
  req.session.form.activePath = req.session.form.activePath || steps[0].path
  return next()
}

const validateRequestedStep = (steps) => (req, res, next) => {
  const step = getStepByPath(req.url)(steps)

  const requestedPathIsValid = stateMachine.dispatch(
    'validateRequestedStep',
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

const saveDataToSession = (steps) => (req, res, next) => {
  const step = getStepByPath(req.url)(steps)

  step.fields.forEach(field => {
    req.session.form[field] = req.body[field]
  })

  console.log('FORM DATA:', req.session.form)

  return next()
}

const renderView = (steps) => (req, res) => {
  const step = getStepByPath(req.url)(steps)
  const nextStep = getStepByPath(step.next)(steps)

  if (req.method === 'POST') {
    // If no errors, update active path and redirect to next step
    req.session.form.activePath = nextStep.path
    return res.redirect(nextStep.path)
  }

  res.locals.formAction = step.path
  return res.render(step.view, { title: 'title' })
}

module.exports = {
  initFormWizardSession,
  validateRequestedStep,
  saveDataToSession,
  renderView,
}
