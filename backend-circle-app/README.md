# backend-circle-app

Backend system for circle app

```
docker run -p 5432:5432 \
-e POSTGRES_DB=testing \
-e POSTGRES_USER=testing \
-e POSTGRES_PASSWORD=testing \
-v backend_postgres:/var/lib/postgresql/data \
-d postgres:12.2-alpine
```

### Get Certificate https

Amazon Linux 2 doesn't have epel-release in its repositories, but I've found you can install the EPEL RPM package itself, and then you'll be able to install certbot or certbot-nginx from there.

Download the RPM

`curl -O http://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm`
Then install it

`sudo yum install epel-release-latest-7.noarch.rpm`

`sudo yum install certbot`

`sudo certbot`

`sudo systemctl status nginx`

`sudo systemctl start nginx`

`sudo certbot-auto certonly --standalone -d apidev.circles.berlin`

`certbot renew`

copy the certs to allo nginx fo be able to find them
`sudo cp -r /etc/letsencrypt/archive/apidev.circles.berlin /etc/nginx/certs`

### Redirect to 443

```
    server {
        listen 80;
        listen [::]:80;
        server_name apidev.circles.berlin;
        return 301 https://$server_name$request_uri;
    }
```

### SSL conf

```
        listen       443 ssl http2;
        listen       [::]:443 ssl http2;
        server_name  apidev.circles.berlin;
        root         /usr/share/nginx/html;

        ssl_certificate "certs/fullchain1.pem";
        ssl_certificate_key "certs/privkey1.pem";
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
        ssl_session_cache shared:SSL:5m;
        ssl_session_timeout 1h;
        add_header Strict-Transport-Security “max-age=15768000” always;
```

### Full nginx file

```
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    upstream app_upstream {
        server localhost:3001;
    }

    upstream app_messages_upstream {
        server localhost:8484;
    }

    server {
        listen 80;
        listen [::]:80;
        server_name apidev.circles.berlin;
        return 301 https://$server_name$request_uri;
    }

    # server {
    #     listen       80 default_server;
    #     listen       [::]:80 default_server;
    #     server_name  apidev.circles.berlin;
    #     root         /usr/share/nginx/html;

    #     # Load configuration files for the default server block.
    #     include /etc/nginx/default.d/*.conf;

    #     location / {
    #     }

    #     error_page 404 /404.html;
    #         location = /40x.html {
    #     }

    #     error_page 500 502 503 504 /50x.html;
    #         location = /50x.html {
    #     }
    # }

# Settings for a TLS enabled server.

    server {
        listen       443 ssl http2;
        listen       [::]:443 ssl http2;
        server_name  apidev.circles.berlin;
        root         /usr/share/nginx/html;

        ssl_certificate "certs/fullchain1.pem";
        ssl_certificate_key "certs/privkey1.pem";
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
        ssl_session_cache shared:SSL:5m;
        ssl_session_timeout 1h;
        add_header Strict-Transport-Security “max-age=15768000” always;
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers PROFILE=SYSTEM;
#        ssl_prefer_server_ciphers on;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location /api/ {
            #rewrite /api/(.*) /$1  break;
            proxy_pass http://app_upstream/;
            proxy_redirect     off;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Host $server_name;
        }

        location /messages/ {
            #rewrite /messages/(.*) /$1  break;
            proxy_pass http://app_messages_upstream/;
            proxy_redirect     off;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Host $server_name;
        }

        # location / {
        # }

        # error_page 404 /404.html;
        #     location = /40x.html {
        # }

        # error_page 500 502 503 504 /50x.html;
        #     location = /50x.html {
        # }
    }

}
```

`sudo systemctl restart nginx.service`

### Versioning

Here is an example of the release type that will be done based on a commit messages:

Bumping
Manual Bumping: Any commit message that includes #major, #minor, or #patch will trigger the respective version bump. If two or more are present, the highest-ranking one will take precedence.

Automatic Bumping: If no #major, #minor or #patch tag is contained in the commit messages, it will bump whichever DEFAULT_BUMP is set to (which is minor by default). Disable this by setting DEFAULT_BUMP to none.
