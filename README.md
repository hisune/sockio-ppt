sockio-ppt
-----
SockIO PPT, the programmer's PPT!A simple nodejs PPT service that support remote control.Write a `pug` template as a online PPT!

SockIO PPT, 程序猿的PPT，支持远程控制多个PPT client端，解决远程PPT遥控问题。
不再需要人肉翻页PPT，不再需要共享屏幕。PPT书写简单快捷，只要你懂`pug`模版格式就能很快的写出你的PPT！

Feature
-----
- 简单，常用PPT展示功能实现。嗯，代码也很简单
- 快捷，仅需编写简单的`pug`模板即可生成PPT，特别适合程序猿
- 安全，演示端URL和控制端URL均在命令行生成，且可自定义`失效时间`，再也不怕某些国内浏览器上报你访问的URL泄漏隐私
- 智能，一个控制端URL可`实时控制`多个演示端URL，解决跨地域PPT分享痛点，再也无需在远程人肉操作PPT或共享屏幕

Requirement
-----
nodejs 4.+ version

How to use it?
-----
```bash
git clone https://github.com/hisune/sockio-ppt.git
cd sockio-ppt
npm install
cp config.default.js config.js # then modify your config.js
node server
```
Then, write a [pug](https://github.com/pugjs/pug) template and copy it to `ppts` folder.

`demo.pug`
```pug
style.
    .center{
        max-width: 200px;
    }

.section.active
    h1 SockIO PPT, the programmer's PPT!
.section
    h1 test2
    .center
        p.hidden hidden slide test 1
        p.hidden hidden slide 2
        p.hidden hidden slide test 3
        p.hidden hidden slide test test 4
.section
    h1 test3
    .center
        p.hidden hidden slide test 1
        p.hidden hidden slide 2
        p.hidden hidden slide test 3
        p.hidden hidden slide test test 4
.section
    h1 test4
.section
    h1 test5

script(type='text/javascript').
    var options = {
        sectionsColor: ['#f2f2f2', '#4BBFC3', '#7BAABE', 'whitesmoke', '#ccddff']
    };
```

Generate a client side online PPT url
-----
```bash
# node generate pug_name [pug or ctrl] [link number] [expire sec]
node generate demo pug 5 60 # Generate 5 client side urls whitch will expired after 1 minute
```
Generate a control side online PPT url
-----
whitch you can open it in mobile to control client side PPT
```bash
# node generate pug_name [pug or ctrl] [link number] [expire sec]
node generate demo ctrl 1 60 # Generate a client side url whitch will expired after 1 minute
```

Use nginx SSL
-----

```bash
server{
	listen 443;
	ssl on;
	ssl_certificate key/sockio.crt;
	ssl_certificate_key key/sockio.key;

	server_name sockio.com www.sockio.com;

	location / {
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_http_version 1.1;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header Host $host;
		proxy_pass http://127.0.0.1:3000;
	}

	access_log  /path_to_your_log_dir/sockio.com.log  access;
}
server{
	listen 80;
	server_name sockio.com www.sockio.com;
	return 301 https://sockio.com$request_uri;
}
```

About author
-----
[Hisune](https://hisune.com)

Offical site
-----
[SockIO](https://sockio.com)

License
-----
MIT
