// TO DO: make prop values constants e.g. [IN_PROGRESS]
const stateMachine = {
  transitions: {
    IN_PROGRESS: {
      validateStep: (activePath, requestedPath) => activePath === requestedPath,
    },
    REVIEWING: {
    },
    COMPLETE: {
    },
  },

  dispatch(actionName, state, ...payload) {
    const actions = this.transitions[state]
    const action = this.transitions[state][actionName]

    if (action) {
      return action(...payload)
    }
  },
}

module.exports = {
  stateMachine,
}
