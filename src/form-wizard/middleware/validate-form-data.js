const { isEmpty } = require('ramda')
const { getStepByPath } = require('./get-step-by-path')
const { validations } = require('./validations')

// TO DO: pass validations into wizard as argument
const validateFormData = (steps, fields) => (req, res, next) => {
  const step = getStepByPath(req.url, steps)
  const errors = {}

  step.fields.forEach(field => {
    const validationFn = validations[fields[field].validation]
    const validationMessage = validationFn(req.body[field])

    if (typeof validationMessage === 'string') {
      errors[field] = {
        text: validationMessage
      }
    }
  })

  if (!isEmpty(errors)) {
    res.locals.errors = errors
  }

  return next()
}

module.exports = {
  validateFormData,
}
