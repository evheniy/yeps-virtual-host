const App = require('yeps');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { resolve } = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const error = require('yeps-error');
const VirtualHost = require('..');
const Router = require('yeps-router');
const expect = chai.expect;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const options = {
    key: fs.readFileSync(resolve(__dirname, 'ssl', 'key.pem')),
    cert: fs.readFileSync(resolve(__dirname, 'ssl', 'cert.pem'))
};

chai.use(chaiHttp);
let app;

describe('YEPS cookies parser', async () => {

    beforeEach(() => {
        app = new App();
        app.then(error());
    });

    it('should test http method', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        const vhost = new VirtualHost();

        vhost.http('yeps.info').then(async ctx => {
            isTestFinished1 = true;
            ctx.res.statusCode = 200;
            ctx.res.end('');
        });

        app.then(vhost.resolve());

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .set('Host', 'yeps.info')
            .send()
            .then(res => {
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

        vhost.all('yeps.info').then(async ctx => {
            isTestFinished1 = true;
            ctx.res.statusCode = 200;
            ctx.res.end('');
        });

        app.then(vhost.resolve());

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .set('Host', 'yeps.info')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

    it('should test https method', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        const vhost = new VirtualHost();

        vhost.https('yeps.info').then(async ctx => {
            isTestFinished1 = true;
            ctx.res.statusCode = 200;
            ctx.res.end('');
        });

        app.then(vhost.resolve());

        await chai.request(https.createServer(options, app.resolve()))
            .get('/')
            .set('Host', 'yeps.info')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

    it('should test all method for https', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        const vhost = new VirtualHost();

        vhost.all('yeps.info').then(async ctx => {
            isTestFinished1 = true;
            ctx.res.statusCode = 200;
            ctx.res.end('');
        });

        app.then(vhost.resolve());

        await chai.request(https.createServer(options, app.resolve()))
            .get('/')
            .set('Host', 'yeps.info')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

    it('should test 404 error', async () => {
        let isTestFinished = false;

        const vhost = new VirtualHost();

        vhost.http('api.yeps.info').then(async ctx => {
            ctx.res.statusCode = 200;
            ctx.res.end('');
        });

        app.then(vhost.resolve());

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .set('Host', 'yeps.info')
            .send()
            .catch(err => {
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

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .set('Host', 'yeps.info')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test router', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        const router = new Router();

        router.get('/').then(async ctx => {
            isTestFinished1 = true;
            ctx.res.statusCode = 200;
            ctx.res.end('homepage');
        });

        const vhost = new VirtualHost();

        vhost
            .http('yeps.info')
            .then(router.resolve());

        app.then(vhost.resolve());

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .set('Host', 'yeps.info')
            .send()
            .then(res => {
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

        vhost.http('*.yeps.info').then(async ctx => {
            isTestFinished1 = true;
            ctx.res.statusCode = 200;
            ctx.res.end('');
        });

        app.then(vhost.resolve());

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .set('Host', 'api.yeps.info')
            .send()
            .then(res => {
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

        vhost.http(/yeps.info/).then(async ctx => {
            isTestFinished1 = true;
            ctx.res.statusCode = 200;
            ctx.res.end('');
        });

        app.then(vhost.resolve());

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .set('Host', 'yeps.info')
            .send()
            .then(res => {
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

        vhost.catch().then(async ctx => {
            isTestFinished1 = true;
            ctx.res.statusCode = 200;
            ctx.res.end('');
        });

        app.then(vhost.resolve());

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .set('Host', '')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

});
