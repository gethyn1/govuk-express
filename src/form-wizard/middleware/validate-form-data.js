const { getStepByPath } = require('./get-step-by-path')
const { validations } = require('./validations')

const validateField = (req, fields, field) => {
  const fieldValidation = fields[field].validation
  const validator = validations[fieldValidation]
  return validator(req.body[field])
}

const handleFieldValidation = (req, res, fields) => (field) => {
  const validationMessage = validateField(req, fields, field)

  if (typeof validationMessage === 'string') {
    res.locals.errors[field] = {
      text: validationMessage,
    }
  }
}

// TO DO: pass validations into wizard as argument
const validateFormData = (steps, fields) => (req, res, next) => {
  const step = getStepByPath(req.url, steps)
  res.locals.errors = {}
  step.fields.forEach(handleFieldValidation(req, res, fields))
  return next()
}

module.exports = {
  validateFormData,
}
