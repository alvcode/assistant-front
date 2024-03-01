FROM node:20.11.1-bookworm-slim

# Установите рабочий каталог внутри контейнера
WORKDIR /app

# Копируйте файлы проекта и его зависимости в контейнер
COPY package*.json ./
RUN npm install

COPY . .

# Запуск разработки
CMD ["npm", "run", "dev"]