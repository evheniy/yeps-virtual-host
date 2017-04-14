# YEPS Virtual Host

It helps to work with different domains splitting http / https protocols

[![NPM](https://nodei.co/npm/yeps-virtual-host.png)](https://npmjs.org/package/yeps-virtual-host)

[![npm version](https://badge.fury.io/js/yeps-virtual-host.svg)](https://badge.fury.io/js/yeps-virtual-host)
[![Build Status](https://travis-ci.org/evheniy/yeps-virtual-host.svg?branch=master)](https://travis-ci.org/evheniy/yeps-virtual-host)
[![Coverage Status](https://coveralls.io/repos/github/evheniy/yeps-virtual-host/badge.svg?branch=master)](https://coveralls.io/github/evheniy/yeps-virtual-host?branch=master)
[![Linux Build](https://img.shields.io/travis/evheniy/yeps-virtual-host/master.svg?label=linux)](https://travis-ci.org/evheniy/)
[![Windows Build](https://img.shields.io/appveyor/ci/evheniy/yeps-virtual-host/master.svg?label=windows)](https://ci.appveyor.com/project/evheniy/yeps-virtual-host)

[![Dependency Status](https://david-dm.org/evheniy/yeps-virtual-host.svg)](https://david-dm.org/evheniy/yeps-virtual-host)
[![devDependency Status](https://david-dm.org/evheniy/yeps-virtual-host/dev-status.svg)](https://david-dm.org/evheniy/yeps-virtual-host#info=devDependencies)
[![NSP Status](https://img.shields.io/badge/NSP%20status-no%20vulnerabilities-green.svg)](https://travis-ci.org/evheniy/yeps-virtual-host)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/evheniy/yeps-virtual-host/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/evheniy/yeps-virtual-host.svg)](https://github.com/evheniy/yeps-virtual-host/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/evheniy/yeps-virtual-host.svg)](https://github.com/evheniy/yeps-virtual-host/network)
[![GitHub issues](https://img.shields.io/github/issues/evheniy/yeps-virtual-host.svg)](https://github.com/evheniy/yeps-virtual-host/issues)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/evheniy/yeps-virtual-host.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)


## How to install

    npm i -S yeps-virtual-host
  

## How to use

### YEPS config:

    const App = require('yeps');
    const VirtualHost = require('yeps-virtual-host');
    const error = require('yeps-error');
    
    const app = new App();
    const vhost = new VirtualHost();
    
    app.all([
        error();
    ]);
    
### HTTP:

    vhost
        .http('yeps.info')
        .then(async ctx => {
            ctx.res.statusCode = 200;
            ctx.res.end('homepage');     
        });
        
### HTTPS:

    vhost
        .https('yeps.info')
        .then(async ctx => {
            ctx.res.statusCode = 302;
            ctx.res.setHeader('Location', 'http://yeps.info/');
            ctx.res.end();     
        });
        
### Any host:

    vhost
        .any('*.yeps.info')
        .then(async ctx => {
            ctx.res.statusCode = 302;
            ctx.res.setHeader('Location', 'http://yeps.info/');
            ctx.res.end();      
        });    
            
### All methods are wrappers for catch() method:

    catch({ 
        domain, 
        protocol: '*|http|https' 
    })

Example: 

    vhost
        .catch({ domain: '*.yeps.info', protocol: '*' })
        .then(async ctx => {
            ctx.res.statusCode = 302;
            ctx.res.setHeader('Location', 'http://yeps.info/');
            ctx.res.end();      
        });
    
### Add virtual host to app:
    
    app.then(vhost.resolve());


### With router:

    const Router = require('yeps-router');
    
    const siteRouter = new Router();
    
    siteRouter.get('/').then(async ctx => {
        ctx.res.statusCode = 200;
        ctx.res.end('homepage');     
    });
    
    vhost
        .http('yeps.info')
        .then(siteRouter.resolve());    


    const apiRouter = new Router();
    
    apiRouter.get('/').then(async ctx => {
        ctx.res.statusCode = 200;
        ctx.res.setHeader('Content-Type', 'application/json');
        ctx.res.end('{"status":"OK"}');     
    });
    
    vhost
        .http('api.yeps.info')
        .then(apiRouter.resolve()); 
    
    
    app.then(vhost.resolve());

#### [YEPS documentation](http://yeps.info/)