# assistant frontend

### Развернуть проект в prod

- Установить на сервере build-essential и докер
```
sudo apt install build-essential
```
- Стянуть проект

- Создать конфиг в nginx
```
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/assistant-front
ln -s /etc/nginx/sites-available/assistant-front /etc/nginx/sites-enabled/
```

```
nano /etc/nginx/sites-available/assistant-front
```

```
root /var/www/assistant-front/dist;

# Add index.php to the list if you are using PHP
index index.html;

charset utf-8;

server_name <domain here>;

location / {
        # First attempt to serve request as file, then
        # as directory, then fall back to displaying a 404.
        try_files $uri $uri/ /index.html;
}
```

```
sudo service nginx restart
```

- Добавить конфиг в src/config.js
```
export default {
    api_point: 'https://<assistant-back url>',
}
```

- Выполнить сборку проекта
```
sudo make build
```

- Установим snap и certbot и выпустим сертификат
```
sudo apt install snapd
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx
```