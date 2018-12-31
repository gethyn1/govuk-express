const { getStepByPath } = require('./get-step-by-path')

const saveFormData = (steps) => (req, res, next) => {
  const step = getStepByPath(req.url, steps)

  step.fields.forEach(field => {
    req.session.form[field] = req.body[field]
  })

  console.log('FORM DATA:', req.session.form)

  return next()
}

module.exports = {
  saveFormData,
}
