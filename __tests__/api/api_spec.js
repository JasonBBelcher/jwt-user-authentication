require('dotenv').config();
const config = require('config');
const db = require('mongoose');
const PORT = process.env.PORT;
const DEV_SERVER = process.env.DEV_SERVER;
const TEST_DB = config.get('Database.host');
const frisby = require('frisby');

beforeAll(() => {
  db.connect(TEST_DB).then(db =>
    console.log('connected to : ', TEST_DB, '...')
  );
});

afterAll(() => {
  db.connect(
    TEST_DB,
    function() {
      db.connection.db
        .dropDatabase()
        .then(() => console.log(TEST_DB, 'dropped..'));
    }
  );
});

it('/signup POST should return http status of 400 (bad request)', function() {
  return frisby
    .setup({
      request: {
        headers: {
          'X-Auth-Registration': process.env.REGISTRATION_TOKEN_NASHVILLE
        }
      }
    })
    .post(`${DEV_SERVER}:${PORT}/api/auth/signup`)
    .expect('status', 400);
});

it('/signup POST should return http status of 201 (resource created)', function() {
  return frisby
    .setup({
      request: {
        headers: {
          'X-Auth-Registration': process.env.REGISTRATION_TOKEN_NASHVILLE
        }
      }
    })
    .post(`${DEV_SERVER}:${PORT}/api/auth/signup`, {
      username: 'Joe',
      password: 'test',
      email: 'test@email.com'
    })
    .expect('status', 201);
});
it('/signup POST should return username of Jason', function() {
  return frisby
    .setup({
      request: {
        headers: {
          'X-Auth-Registration': process.env.REGISTRATION_TOKEN_NASHVILLE
        }
      }
    })
    .post(`${DEV_SERVER}:${PORT}/api/auth/signup`, {
      username: 'Jason',
      password: 'test',
      email: 'jason@email.com'
    })
    .expect('json', 'username', 'Jason');
});

it('/signup duplicate POST should return validation error message', function() {
  return frisby
    .setup({
      request: {
        headers: {
          'X-Auth-Registration': process.env.REGISTRATION_TOKEN_NASHVILLE
        }
      }
    })
    .post(`${DEV_SERVER}:${PORT}/api/auth/signup`, {
      username: 'Jason',
      password: 'test',
      email: 'jason@email.com'
    })
    .expect('json', 'err', {
      message:
        'User validation failed: username: Error, expected username to be unique., email: Error, expected email to be unique.' ||
        'User validation failed: email: Error, expected email to be unique., username: Error, expected username to be unique.'
    });
});

it('/signup POST should return an object with 3 props of string type', function() {
  return frisby
    .setup({
      request: {
        headers: {
          'X-Auth-Registration': process.env.REGISTRATION_TOKEN_NASHVILLE
        }
      }
    })
    .post(`${DEV_SERVER}:${PORT}/api/auth/signup`, {
      username: 'Ali',
      password: 'test',
      email: 'ali@email.com'
    })
    .expect('jsonTypes', {
      _id: frisby.Joi.string(),
      username: frisby.Joi.string(),
      token: frisby.Joi.string()
    });
});

it('/signup POST with invalid registrationToken should return error', function() {
  return frisby
    .setup({
      request: {
        headers: {
          'X-Auth-Registration': 'faketoken'
        }
      }
    })
    .post(`${DEV_SERVER}:${PORT}/api/auth/signup`, {
      username: 'Bob',
      password: 'test',
      email: 'bob@email.com'
    })
    .expect('json', 'err', {
      message: 'Your registration token is not valid'
    });
});

it('/signup POST with no registrationToken should return error', function() {
  return frisby
    .post(`${DEV_SERVER}:${PORT}/api/auth/signup`, {
      username: 'Tilda',
      password: 'test',
      email: 'tilda@email.com'
    })
    .expect('json', 'err', {
      message: 'no registration token provided. Cannot continue'
    });
});

it('/signup POST with no email property should return error', function() {
  return frisby
    .setup({
      request: {
        headers: {
          'X-Auth-Registration': process.env.REGISTRATION_TOKEN_ATLANTA
        }
      }
    })
    .post(`${DEV_SERVER}:${PORT}/api/auth/signup`, {
      username: 'Tom',
      password: 'test'
    })
    .expect('json', 'err', {
      message: 'User validation failed: email: Path `email` is required.'
    });
});
