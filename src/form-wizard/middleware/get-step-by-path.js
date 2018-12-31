const getStepByPath = (path, steps) => steps.find(step => step.path === path)

module.exports = {
  getStepByPath,
}
