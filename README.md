sockio-ppt
-----
SockIO PPT, the programmer's PPT!A simple nodejs PPT service that support remote control.Write a `pug` template as a online PPT!

SockIO PPT, 程序猿的PPT，支持远程控制多个PPT client端，解决远程PPT遥控问题。
不再需要人肉翻页PPT，不再需要共享屏幕。PPT书写简单快捷，只要你懂`pug`模版格式就能很快的写出你的PPT！

[https://hisune.com/view/42/sockio-ppt-remote-control-html-ppt](https://hisune.com/view/42/sockio-ppt-remote-control-html-ppt)

[Online demo](https://sockio.com/ppt?ctrl=d279530ed2537ecdea2d51e3)

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
link(rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.5.0/styles/androidstudio.min.css")
script(src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.5.0/highlight.min.js")
script(src="//cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js")

.section
    h2 SockIO PPT, the programmer's PPT!
    h3
        a(href="https://github.com/hisune/sockio-ppt" target="_blank") https://github.com/hisune/sockio-ppt
.section
    h2 Feature
    .center-table(style="max-width: 80%;")
        .hidden
            h3 ●简单
            h4 常用PPT展示功能均已经实现。除此之外，嗯，代码也很简单；
        .hidden
            h3 ● 快捷
            h4
                | 仅需编写简单的
                a(href="https://github.com/pugjs/pug" target="_blank") pug
                | 模板即可生成PPT，特别适合程序猿；
        .hidden
            h3 ● 安全
            h4 演示端URL和控制端URL均在命令行生成，且可自定义失效时间，再也不怕某些国内浏览器上报你访问的URL泄漏隐私；
        .hidden
            h3 ● 智能
            h4 一个控制端URL可实时控制多个演示端URL，解决跨地域PPT分享痛点，再也无需在远程人肉操作PPT或共享屏幕。
.section
    h1 HTTP - ajax轮询
    .left.hidden.center-table(style="text-indent: 8vw;")
        h4 client: 有消息吗？(req)
        h4 server: 木有(res)
        h4 client: 有消息吗？(req)
        h4 server: 木有！(res)
        h4 client: 有消息吗？(req)
        h4 server: 木有！！！(res)
        h4 client: 有消息吗？(req)
        h4 server: 。。。木有！！！(res)
    .right.hidden
        pre
            code(style="font-size: 2vw;")
                | var ajax = function()
                | {
                |    $.ajax({
                |        url: 'http://xxoo.com/xxoo',
                |        success: function(ret){
                |            // ... do something
                |            setTimeout(ajax, 2000);
                |        }
                |    });
                | };
                | ajax();
.section
    h2 来张图片
    div(style="height: 40vh")
        img(src="/demo/girl.jpg")
.section
    h1 Q & A
    .left
        h4 PPT URL
        #qrcode-ppt
    .right
        h4 SockIO PPT 项目地址
        #qrcode-sockio
script(type='text/javascript').
    var options = {
        sectionsColor: ['#f2f2f2', '#4BBFC3', '#7BAABE', '#fff', 'whitesmoke']
    };
    hljs.initHighlightingOnLoad();
    var initQrcode = function()
    {
        var qrcodeWidth = $(window).width() / 4;
        $('#qrcode-ppt').empty().qrcode({width: qrcodeWidth,height: qrcodeWidth,text: window.location.href.split('#')[0]});
        $('#qrcode-sockio').empty().qrcode({width: qrcodeWidth,height: qrcodeWidth,text: 'https://github.com/hisune/sockio-ppt'});
    };
    window.onresize = function(event) {
        initQrcode();
    };
    initQrcode();
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
