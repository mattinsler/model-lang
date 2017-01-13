import { model } from './';

const User = model`
email Email {
  required true
}
username String {
  required true
  length >= 4
  length <= 15
}
password String {
  required true
  length >= 8
  length <= 30
}
foo String {
  contains "hello"
}
isAdmin Boolean {
  default false
}
`;

// console.log(User);

const { error, value } = User.validate({
  email: 'matt.insler@gmail.com',
  password: 'foo'
});

if (error) {
  console.log(error.details);
} else {
  console.log(value);
}
