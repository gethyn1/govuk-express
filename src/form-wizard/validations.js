const validations = {
  required: (input) => {
    const validated = input.trim() !== ''
    return validated ? false : 'Value is required'
  },
}

module.exports = {
  validations,
}
