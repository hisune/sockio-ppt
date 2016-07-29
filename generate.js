/**
 * Created by Hisune on 2016/7/28.
 * User: hi@hisune.com
 *
 * 生成一个临时url
 * node generate pug_name [pug or ctrl] [link number] [expire sec]
 */
'use strict';

if(process.argv.length < 3){
    console.log('plz run as "node generate ppts_name [url number]"');
    process.exit(1)
}

const fs = require('fs'),
    config = require('./config.js');

process.argv[2] = process.argv[2].replace(/\W/gi, ''); // 过滤
if(!fs.existsSync(__dirname + '/ppts/' + process.argv[2] + '.pug')){
    console.log('pug file "' + process.argv[2] + '" not exists');
    process.exit(1)
}

let count = 0, generateName = 'pug', generateExpire = 0;
if(process.argv[3] && (process.argv[3] == 'pug' || process.argv[3] == 'ctrl'))
    generateName = process.argv[3];
if(process.argv[4])
    count = parseInt(process.argv[4]);
if(process.argv[5])
    generateExpire = parseInt(process.argv[5]);
if(count < 1) count = config.generate_default_num;
if(generateExpire < 10) generateExpire = config.generate_default_timeout;

let generateDir = __dirname + '/generate/' + generateName + '/';
// 过期检测
let generates = fs.readdirSync(generateDir), now = Date.now() / 1000 | 0;
generates.forEach((item) => {
    let file = generateDir + item, content = fs.readFileSync(file).toString().split(',');
    if(now > content[1])
        fs.unlinkSync(file);
});

console.log('generate ' + count + ' ' + generateName + ' key:');
for(let i = 0; i < count; i++){
    require('crypto').randomBytes(12, (err, buffer) => {
        let token = buffer.toString('hex');
        fs.writeFileSync(generateDir + token, process.argv[2] + ',' + (generateExpire + now));
        console.log(config.url + 'ppt?' + generateName + '=' + token);
    });
}