// requires for testing
const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = (exports.lab = Lab.script());

const it = lab.it;
const describe = lab.describe;

const server = require('../lib/');

describe('unit test for server routes', () => {
  it('GET /', (done) => {
    server.inject('/', (res) => {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('GET /', (done) => {
    server.inject('/', (res) => {
      expect(typeof res.payload).to.be.equal('string');
      done();
    });
  });

  it('GET assets fom server object works', (done) => {
    server.inject('/assets/favicon.ico', (res) => {
      expect(res.statusCode).to.be.equal(200);
      done();
    });
  });

  it('GET assets fom server object works', (done) => {
    server.inject('/assets/favi.ico', (res) => {
      expect(res.statusCode).not.to.be.equal(200);
      done();
    });
  });

  it('GET vue bundle fom server object works', (done) => {
    server.inject('/dist/build.js', (res) => {
      expect(res.statusCode).to.be.equal(200);
      done();
    });
  });

  it('Login user with right credentials', (done) => {
    server.inject(
      { url: '/login', method: 'POST', payload: { userName: '1639081', password: 'password' } },
      (res) => {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
  });


  it('Login user with right credentials', (done) => {
    server.inject(
      { url: '/login', method: 'POST', payload: { userName: '1639081', password: 'password' } },
      (res) => {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
  });


  it('Login user with mistake in password', (done) => {
    server.inject(
      { url: '/login', method: 'POST', payload: { userName: '1639081', password: 'pasword' } },
      (res) => {
        expect(res.statusCode).to.be.equal(401);
        done();
      });
  });


  it('Login user with mistake in username', (done) => {
    server.inject(
      { url: '/login', method: 'POST', payload: { userName: '163981', password: 'password' } },
      (res) => {
        expect(res.statusCode).to.be.equal(401);
        done();
      });
  });


  it('Login user with no username', (done) => {
    server.inject(
      { url: '/login', method: 'POST', payload: { password: 'password' } },
      (res) => {
        expect(res.statusCode).to.be.equal(401);
        done();
      });
  });


  it('Login user with no password', (done) => {
    server.inject(
      { url: '/login', method: 'POST', payload: { userName: '1639081' } },
      (res) => {
        expect(res.statusCode).to.be.equal(401);
        done();
      });
  });


  it('Login user with no payload', (done) => {
    server.inject(
      { url: '/login', method: 'POST' },
      (res) => {
        expect(res.statusCode).to.be.equal(401);
        done();
      });
  });

  it('Authenticate user', (done) => {

    server.inject(
      { url: '/login', method: 'POST', payload: { userName: '1639081', password: 'password' } },
      (user) => {
        server.inject({ url: '/authenticate', method: 'POST', payload: { token: user.result.token } }, (res) => {
          expect(res.statusCode).to.be.equal(200);
          done();
        });
      });
  });
});
