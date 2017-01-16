import peg from 'pegjs';

const generate = {
  recursive(name) {
    return `= _ head:${name} tail:(_ next:${name} { return next })* _ { return [head].concat(tail).reduce((a, b) => a.concat(b), []) }`;
  },
  rule(arr) {
    return '\n  = ' + arr.join('\n  / ');
  },
  property({ multi, name, operations, type }) {
    if (operations && operations.length > 0) {
      // order by length -- longest first
      operations.sort((l, r) => r.length - l.length);
      const ops = operations.map(JSON.stringify).join(' / ');

      if (multi) {
        return [
          `"${name}" _ heado:$(${ops}) _ head:${type} tail:(_ "and" _ nexto:$(${ops}) _ next:${type} { return { property: '${name}', operation: nexto, value: next } })* _ { return [{ property: '${name}', operation: heado, value: head }].concat(tail).reduce((a, b) => a.concat(b), []) }`
        ];
      } else {
        return [
          `"${name}" _ o:${ops} _ v:${type} { return { property: '${name}', operation: o, value: v } }`
        ];
      }
    } else {
      if (multi) {
        return [
          `"${name}" _ head:${type} tail:(_ "and" _ next:${type} { return { property: '${name}', value: next } })* _ { return [{ property: '${name}', value: head }].concat(tail).reduce((a, b) => a.concat(b), []) }`
        ];
      } else {
        return [
          `"${name}" _ v:${type} { return { property: '${name}', value: v } }`
        ];
      }
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

for (let { name, properties = [] } of config.dataTypes) {
  const rules = [
    `id:Identifier _ "${name}" _ "{" _ "}"  { return { name: id, dataType: '${name}', rules: [] } }`,
    `id:Identifier _ "${name}"  { return { name: id, dataType: '${name}', rules: [] } }`
  ];

  if (properties.length > 0) {
    rules.unshift(
      `id:Identifier _ "${name}" _ "{" _ rules:${name}Rules _ "}"  { return { name: id, dataType: '${name}', rules: rules } }`
    );

    parts.push(`${name}Rules ${generate.recursive(`${name}Rule`)}`);

    const p = properties.reduce((arr, prop) => arr.concat(generate.property(prop)), []);
    parts.push(`${name}Rule ${generate.rule(p)}`);
  }

  parts.push(`${name}Property ${generate.rule(rules)}`);
}

parts.push(`
Identifier
  = [a-zA-Z][a-zA-Z0-9_]* { return text() }

Boolean
  = "true" { return true }
  / "false" { return false }

String
  = '"' str:$[^"]* '"' { return str }
  / "'" str:$[^']* "'" { return str }

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
