# my-tag-lk

### Развернуть проект в prod

- Установить на сервере build-essential и докер
```
sudo apt install build-essential
```
- Стянуть проект


- Добавить конфиг в src/config.js
```
export default {
    api_point: 'https://api.my-tag.ru',
}
```

- Выполнить сборку проекта
```
sudo make build
```

- Установить и настроить NGINX по пути на директорию dist, получить SSL-сертификат