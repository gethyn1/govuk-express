const steps = [
  {
    path: '/name',
    next: '/email',
    view: 'form',
    fields: ['firstName', 'secondName'],
    template: {
      title: 'Personal details',
    },
  },
  {
    path: '/email',
    view: 'form',
    fields: ['email'],
    template: {
      title: 'Contact details',
    },
  },
]

const fields = {
  firstName: {
    id: 'firstName',
    label: 'First name',
    validation: 'required',
  },
  secondName: {
    id: 'secondName',
    label: 'Second name',
    validation: 'required',
  },
  email: {
    id: 'email',
    label: 'Email address',
    validation: 'required',
  },
}

module.exports = {
  steps,
  fields,
}
