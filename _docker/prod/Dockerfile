FROM node:20.11.1-bookworm-slim as prod_build

# Установите рабочий каталог внутри контейнера
WORKDIR /app

# Копируйте файлы проекта и его зависимости в контейнер
COPY package*.json ./
RUN npm install

COPY . .

# Сборка проекта
RUN npm run build

COPY --from=prod_build dist ./dist