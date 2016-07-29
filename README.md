sockio-ppt
-----
SockIO PPT, the programmer's PPT!

Requirement
-----
nodejs 4.+ version

How to install
-----
```sh
git clone https://github.com/hisune/sockio-ppt.git
cd sockio-ppt
cp config.default.js config.js # then modify your config.js
node server
```

Generate a client side online PPT url
-----
```sh
# node generate pug_name [pug or ctrl] [link number] [expire sec]
node generate demo pug 5 60 # Generate 5 client side urls whitch will expired after 1 minute
```
Generate a control side online PPT url
-----
whitch you can open it in mobile to control client side PPT
```sh
# node generate pug_name [pug or ctrl] [link number] [expire sec]
node generate demo ctrl 1 60 # Generate a client side url whitch will expired after 1 minute
```

Use nginx SSL
-----

```sh
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
