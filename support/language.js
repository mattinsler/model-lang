export default {
  dataTypes: [{
    name: 'Boolean',
    properties: [{
      name: 'required',
      type: 'Boolean'
    }, {
      name: 'default',
      type: 'Boolean'
    }]
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
    properties: [{
      name: 'required',
      type: 'Boolean'
    }, {
      name: 'default',
      type: 'String'
    }, {
      name: 'contains',
      type: 'String',
      multi: true
    }, {
      name: 'matches',
      type: 'RegularExpression',
      multi: true
    }, {
      name: 'length',
      type: 'Integer',
      operations: [
        '==',
        '<',
        '<=',
        '>',
        '>='
      ],
      multi: true
    }]
  }, {
    name: 'Email',
    properties: [{
      name: 'required',
      type: 'Boolean'
    }, {
      name: 'default',
      type: 'String'
    }, {
      name: 'contains',
      type: 'String',
      multi: true
    }, {
      name: 'matches',
      type: 'RegularExpression',
      multi: true
    }]
  }]
};
