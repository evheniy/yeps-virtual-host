const App = require('yeps');
const chai = require('chai');
const chaiHttp = require('chai-http');
const error = require('yeps-error');
const VirtualHost = require('..');
const Router = require('yeps-router');
const srv = require('yeps-server');
const pem = require('pem');

const { expect } = chai;

chai.use(chaiHttp);
let app;
let server;

describe('YEPS cookies parser', async () => {
  beforeEach(() => {
    app = new App();
    app.then(error());
    server = srv.createHttpServer(app);
  });

  afterEach(() => {
    server.close();
  });

  it('should test http method', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const vhost = new VirtualHost();

    vhost.http('yeps.info').then(async (ctx) => {
      isTestFinished1 = true;
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    await chai.request(server)
      .get('/')
      .set('Host', 'yeps.info')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test all method for http', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const vhost = new VirtualHost();

    vhost.all('yeps.info').then(async (ctx) => {
      isTestFinished1 = true;
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    await chai.request(server)
      .get('/')
      .set('Host', 'yeps.info')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test https method', async () => {
    let isTestFinished = false;

    const vhost = new VirtualHost();

    vhost.https('yeps.info').then(async (ctx) => {
      isTestFinished = true;
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const days = 1;
    const selfSigned = true;

    pem.createCertificate({ days, selfSigned }, (err, { serviceKey: key, certificate: cert }) => {
      if (err) {
        throw err;
      }
      const httpsServer = srv.createHttpsServer({ key, cert }, app);

      chai.request(httpsServer)
        .get('/')
        .set('Host', 'yeps.info')
        .send()
        .end((e, res) => {
          expect(e).to.be.null;
          expect(res).to.have.status(200);
          expect(isTestFinished).is.true;
        });
    });
  });

  it('should test all method for https', async () => {
    let isTestFinished = false;

    const vhost = new VirtualHost();

    vhost.all('yeps.info').then(async (ctx) => {
      isTestFinished = true;
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const days = 1;
    const selfSigned = true;

    pem.createCertificate({ days, selfSigned }, (err, { serviceKey: key, certificate: cert }) => {
      if (err) {
        throw err;
      }
      const httpsServer = srv.createHttpsServer({ key, cert }, app);

      chai.request(httpsServer)
        .get('/')
        .set('Host', 'yeps.info')
        .send()
        .end((e, res) => {
          expect(e).to.be.null;
          expect(res).to.have.status(200);
          expect(isTestFinished).is.true;
        });
    });
  });

  it('should test 404 error', async () => {
    let isTestFinished = false;

    const vhost = new VirtualHost();

    vhost.http('api.yeps.info').then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    await chai.request(server)
      .get('/')
      .set('Host', 'yeps.info')
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 500 error', async () => {
    let isTestFinished = false;

    const vhost = new VirtualHost();

    vhost.http('yeps.info').then(async () => {
      throw new Error('test');
    });

    app.then(vhost.resolve());

    await chai.request(server)
      .get('/')
      .set('Host', 'yeps.info')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test router', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const router = new Router();

    router.get('/').then(async (ctx) => {
      isTestFinished1 = true;
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');
    });

    const vhost = new VirtualHost();

    vhost
      .http('yeps.info')
      .then(router.resolve());

    app.then(vhost.resolve());

    await chai.request(server)
      .get('/')
      .set('Host', 'yeps.info')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test regexp string  domain', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const vhost = new VirtualHost();

    vhost.http('*.yeps.info').then(async (ctx) => {
      isTestFinished1 = true;
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    await chai.request(server)
      .get('/')
      .set('Host', 'api.yeps.info')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test regexp domain', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const vhost = new VirtualHost();

    vhost.http(/yeps.info/).then(async (ctx) => {
      isTestFinished1 = true;
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    await chai.request(server)
      .get('/')
      .set('Host', 'yeps.info')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test empty catch', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const vhost = new VirtualHost();

    vhost.catch().then(async (ctx) => {
      isTestFinished1 = true;
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    await chai.request(server)
      .get('/')
      .set('Host', '')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });
});
