const initialiseSession = (steps) => (req, res, next) => {
  req.session.form = req.session.form || {}
  req.session.formWizardState = req.session.formWizardState || 'IN_PROGRESS'
  req.session.form.activePath = req.session.form.activePath || steps[0].path
  return next()
}

module.exports = {
  initialiseSession,
}
