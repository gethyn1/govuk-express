const { isEmpty, path } = require('ramda')
const { getStepByPath } = require('./get-step-by-path')

const render = (req, res, step, data) => {
  return res.render(step.view, {
    ...step.template,
    csrfToken: req.csrfToken(),
    form: {
      action: step.path,
    },
    fields: data,
  })
}

const renderView = (steps, fields) => (req, res) => {
  const step = getStepByPath(req.url, steps)
  const nextStep = getStepByPath(step.next, steps)
  const fieldsData = step.fields.map(field => fields[field])

  if (req.method === 'POST') {
    if (!isEmpty(res.locals.errors)) {
      return render(req, res, step, fieldsData)
    }

    req.session.form.activePath = path(['path'], nextStep)

    if (typeof nextStep === 'undefined') {
      return res.redirect('/confirm')
    }

    return res.redirect(nextStep.path)
  }

  // TO DO: translate template variables
  return render(req, res, step, fieldsData)
}

module.exports = {
  renderView,
}
