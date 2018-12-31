const steps = [
  {
    path: '/name',
    next: '/email',
    view: 'form',
    fields: ['name'],
    template: {
      title: 'Name',
    },
  },
  {
    path: '/email',
    view: 'form',
    fields: ['email'],
    template: {
      title: 'Email address',
    },
  },
]

const fields = {
  name: {
    validation: 'required',
  },
  email: {
    validation: 'required',
  },
}

module.exports = {
  steps,
  fields,
}
