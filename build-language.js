import peg from 'pegjs';

const generate = {
  recursive(name) {
    return `= _ head:${name} tail:(_ next:${name} { return next })* _ { return [head].concat(tail) }`;
  },
  rule(arr) {
    return '\n  = ' + arr.join('\n  / ');
  },
  properties: {
    boolean(name) {
      return [
        `"${name}" _ v:Boolean { return { property: '${name}', value: v } }`
      ];
    },
    string(name) {
      return [
        `"${name}" _ v:String { return { property: '${name}', value: v } }`
      ];
    },
    integer(name) {
      return [
        `"${name}" _ v:Integer { return { property: '${name}', value: v } }`
      ];
    },
    regex(name) {
      return [
        `"${name}" _ v:RegularExpression { return { property: '${name}', value: v } }`
      ];
    }
  },
  constraints: {
    // enum(name, values, parse) {
    //   return values.map(v => `"${name}" _ "${v}" { return { property: '${name}', value: ${parse(v)} } }`);
    // },
    // string(name) {
    //   return [
    //     `"contains" _ v:String { return { type: 'contains', value: v } }`
    //   ];
    // },
    integer(name) {
      return [
        `"${name}" _ "==" _ v:Integer { return { constraint: '${name}', type: 'equal', value: v } }`,
        `"${name}" _ "<" _ v:Integer { return { constraint: '${name}', type: 'lt', value: v } }`,
        `"${name}" _ "<=" _ v:Integer { return { constraint: '${name}', type: 'lte', value: v } }`,
        `"${name}" _ ">" _ v:Integer { return { constraint: '${name}', type: 'gt', value: v } }`,
        `"${name}" _ ">=" _ v:Integer { return { constraint: '${name}', type: 'gte', value: v } }`
      ];
    },
    regex(name) {
      return [
        `"${name}" _ v:RegularExpression { return { constraint: '${name}', type: 'regex', value: v } }`
      ];
    }
  }
}

function buildLanguage(config) {
  const parts = [];
  parts.push(`
Document ${generate.recursive('Type')}

Type
  = "type" _ id:Identifier _ "{" _ properties:Properties _ "}" { return { type: id, properties: properties } }
  / properties:Properties { return { type: '', properties: properties } }

Properties ${generate.recursive('Property')}

Property ${generate.rule(config.dataTypes.map(({ name }) => `${name}Property`))}
`);

for (let { name, constraints = [], properties = [] } of config.dataTypes) {
  const rules = [
    `id:Identifier _ "${name}" _ "{" _ "}"  { return { name: id, dataType: '${name}', rules: [] } }`,
    `id:Identifier _ "${name}"  { return { name: id, dataType: '${name}', rules: [] } }`
  ];

  if (constraints.length > 0 || properties.length > 0) {
    rules.unshift(
      `id:Identifier _ "${name}" _ "{" _ rules:${name}Rules _ "}"  { return { name: id, dataType: '${name}', rules: rules } }`
    );
  }

  parts.push(`${name}Property ${generate.rule(rules)}`);

  if (constraints.length > 0 || properties.length > 0) {
    parts.push(`${name}Rules ${generate.recursive(`${name}Rule`)}`);

    const p = [
      ...properties.reduce((arr, { name, type }) => arr.concat(generate.properties[type](name)), []),
      ...constraints.reduce((arr, { name, type }) => arr.concat(generate.constraints[type](name)), [])
    ];

    parts.push(`${name}Rule ${generate.rule(p)}`);
  }
}

parts.push(`
Identifier
  = [a-zA-Z][a-zA-Z0-9_]* { return text() }

Boolean
  = "true" { return true }
  / "false" { return false }

String
  = '"' str:$[^"]* '"' { return str }

Integer
  = [0-9]+ { return parseInt(text(), 10) }

RegularExpression
  = "/" rx:$([^\/]*) "/" opts:$([gimuy]*) { return new RegExp(rx, opts) }

_ "blank"
  = (co / ws)*
 
co "comment"
  = "//" (![\\r\\n] .)*
  / "/*" ((!"*/" !"/*" .) / co)* "*/"
 
ws "whitespace"
  = [ \\t\\r\\n]+
`);

  return parts.join('\n');
}

export default buildLanguage;
