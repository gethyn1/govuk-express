const validations = {
  required: (input) => input.trim() === '' ? 'Value is required' : false,
}

module.exports = {
  validations,
}
