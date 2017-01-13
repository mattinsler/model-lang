function defaultProp(type) {
  return {
    name: 'default',
    type
  };
}

const isRequired = {
  name: 'required',
  type: 'boolean'
};

export default {
  dataTypes: [{
    name: 'Boolean',
    properties: [
      isRequired,
      defaultProp('boolean')
    ]
  }, {
  //   name: 'Date',
  //   properties: [
  //     isRequired,
  //     defaultProp('date')
  //   ],
  //   constraints: [{
  //     name: '',
  //     type: ''
  //   }]
  // }, {
    name: 'String',
    properties: [
      isRequired,
      defaultProp('string'),
    {
      name: 'contains',
      type: 'string'
    }],
    constraints: [{
      name: 'length',
      type: 'integer'
    }, {
      name: 'matches',
      type: 'regex'
    }]
  }, {
    name: 'Email',
    properties: [
      isRequired,
      defaultProp('string')
    ]
  }]
};
