/**
 * Created by Hisune on 2016/7/27.
 * User: hi@hisune.com
 */
'use strict';

const express = require('express'),
    fs = require('fs'),
    config = require('./config.js');

let app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', './views');
app.set('view engine', 'pug');

var validateGenerate = function(query)
{
    let ret = {
        name: '',
        key: '',
        ppt: '',
        expire: 0,
        err: null
    };
    if(query['pug']){
        ret.name = 'pug';
        ret.key = query['pug'];
    }else if(query['ctrl']){
        ret.name = 'ctrl';
        ret.key = query['ctrl'];
    }else{
        ret.err = 'invalid generate';
    }

    if(ret.name){
        let file = __dirname + '/generate/' + ret.name + '/' + ret.key;
        if(fs.existsSync(file)){
            try{
                let now = Date.now() / 1000 | 0, content = fs.readFileSync(file).toString().split(',');
                ret.ppt = content[0];
                ret.expire = content[1];
                if(now > ret.expire){
                    ret.err = 'generate out of date';
                }
            }catch(e){
                ret.err = 'generate not found';
            }
        }else{
            ret.err = 'generate not found';
        }
    }

    return ret;
};

// route
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/ppt', (req, res) => {
    let generate = validateGenerate(req.query);
    if(generate.err){
        res.write(generate.err);
        res.end();
    }else{
        res.render(__dirname + '/ppts/' + generate.ppt, (err, html) => { // pug不支持动态include，只能退而求其次，这样来实现动态加载pug
            res.render('ppt.pug', {
                title: generate.ppt + ' - SockIO PPT',
                name: generate.name,
                key: generate.key,
                ppt: generate.ppt,
                html: html
            });
        });
    }
});

// socket.io
let server = require('http').createServer(app);
let io = require('socket.io')(server);
io.on('connection', function(socket){
    let generate = validateGenerate(socket.handshake.query);
    if(!generate.err){
        switch(generate.name){
            case 'ctrl':
                socket.on('roll', (data) => {
                    io.to(generate.ppt).emit('roll', data);
                });
                socket.on('click', (data) => {
                    io.to(generate.ppt).emit('click', data);
                });
                break;
            case 'pug':
                socket.join(generate.ppt);
                break;
        }
    }
});
server.listen(config.port);