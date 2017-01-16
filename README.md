# model-lang

A modeling and validation language.

The basic idea is to have a clean and descriptive language to specify models for things like
microservices interfaces, forms validation ([react-model-forms](https://github.com/mattinsler/react-model-forms)), and more.

The high level idea was inspired by [dml.sh](http://dml.sh/).

## Installation

```shell
$ npm install --save model-lang
```

or

```shell
$ yarn add model-lang
```

## Example

Let's say we wanted to write a basic login form. Usually we just wouldn't validate,
because ... lazy ... Anyway, this doesn't have to be horrible. Here's a version with
a username/password and some reasonable validations.

```js
import mdl from 'model-lang';

const LoginForm = mdl.model`
type LoginForm {
  username String {
    required true
    length >= 4 and <= 15
    matches /[a-z][a-z0-9_]*/i
  }
  password String {
    required true
    length >= 8 and <= 30
    matches /[a-z]/ and /[A-Z]/ and /[0-9]/ and /[^a-z0-9 \t]/i
  }
}
`;

const { errors, value } = LoginForm.validate({
  username: 'username',
  password: 'password'
});
```

OK, let's break that down. First we specify the model with our modeling language.

```js
type LoginForm {
  username String {
    required true
    length >= 4 and <= 15
    matches /[a-z][a-z0-9_]*/i
  }
  password String {
    required true
    length >= 8 and <= 30
    matches /[a-z]/ and /[A-Z]/ and /[0-9]/ and /[^a-z0-9 \t]/i
  }
}
```

We could take an email instead just as easily by changing the `username` block to this.

```js
  email Email {
    required true
  }
```

Here we're using an ES6 template string, but it will work as a function too: `mdl.model('...')`.

The model will have a few properties, one of which is a `validate` method. We then call the validate
method with an object (that isn't valid) and get back an object with `errors` and `value` on it.

If the length of the `errors` array is `0`, it's valid!

## Anonymous Types

Anonymous types are allowed when there is only a single type specified. This will just be a type where
the name is an empty string (`''`). This allows you to leave out a type name for terneness.

So rather than

```js
type LoginForm {
  username String
  password String
}
```

you can just use

```js
username String
password String
}
```

## API

### Methods

#### `compile(schema)`

Compiles a schema string into models. Returns an array of [`Model`](#Model) objects.

```js
const models = mdl.compile(`
type Foo {
  email Email
}
type Bar {
  username String
}
`);

/*
  models looks like
  [{
    name: 'Foo',
    properties: [...],
    validate() {}
  }, {
    name: 'Bar',
    properties: [...],
    validate() {}
  }]
*/
```

#### `model(schema)`

Compiles a single schema string into a model. Returns a [`Model`](#Model) object.

```js
const model = mdl.model(`
type Foo {
  bar String
  baz Boolean
}
`);

/*
  model looks like
  {
    name: 'Foo',
    properties: [...],
    validate() {}
  }
*/
```

### `Model` Object

The object representation of a parsed model schema. This object contains information about the model's
structure as well as a method to validate against it.

#### `name`

The model's type name (a blank string if this is an anonymous type).

#### `properties`

An array of the model's properties.

A single property has a structure that looks like

```js
{
  "name": "Foo",
  "type": "String",
  "isRequired": true,
  "defaultValue": undefined,
  "rules": [{
    "property": "default",
    "value": true
  }, {
    "property": "length",
    "operation": ">=",
    "value": 6
  }]
}
```

#### `validate(data)`

The validation method for the model. Call this with an object to process the validation rules for the model.

`validate()` returns an object with the following structure

```js
{
  "errors": [{
    "type": "Foo",
    "property": "username",
    "message": "\"username\" length must be at least 8 characters long"
  }],
  "value": {
    /* ... */
  }
}
```

## Supported Types

### String

Basic string type. Maps to a Javascript String.

```js
propertyName String

propertyName String {
  required true

  default 'hello world'

  contains 'foo'
  contains "bar"
  contains "foo" and "bar"

  matches /[0-9]/
  matches /[a-z/i and /[0-9]/

  length > 10
  length < 30
  length == 7
  length >= 3 and <= 10
}
```

### Email

String type that has an email validator. Maps to a Javascript String.

```js
propertyName Email

propertyName Email {
  required true

  default 'foo@bar.com'

  contains '@bar.com'

  matches /@(foo|bar)\.com$/
}
```

### Boolean

Basic boolean type. Maps to a Javascript Boolean.

```js
propertyName Boolean

propertyName Boolean {
  required true

  default false
}
```
