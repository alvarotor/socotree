worker_processes 1;

events { worker_connections 1024; }

http {
    sendfile on;
    client_max_body_size 20M;

    upstream app_upstream {
        server app:3001;
    }

    upstream app_messages_upstream {
        server app_messages:8484;
    }

    upstream app_notifications_upstream {
        server app_notifications:8111;
    }

    upstream app_admin_upstream {
        server app_admin:3000;
    }

    server {
        listen 80;
        client_max_body_size 20M;
        proxy_redirect     off;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Host $server_name;
        
        location / {
            try_files /index.html /;
        }

        location /dashboard/ {
            proxy_pass http://app_admin_upstream/;
        }

        location /api/ {
            proxy_pass http://app_upstream/;
        }

        location /notifications/ {
            proxy_pass http://app_notifications_upstream/;
        }
 
        location /messages/ {
            proxy_pass http://app_messages_upstream/;
            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_socket_keepalive on;
            proxy_connect_timeout 1d;
            proxy_send_timeout 1d;
            proxy_read_timeout 1d;
        }
    }
}