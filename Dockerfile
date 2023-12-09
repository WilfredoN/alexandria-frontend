# Фаза сборки приложения
FROM node:latest AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# Фаза запуска приложения на легковесном сервере
FROM nginx:alpine
COPY .nginx/nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html

# Копирование собранного приложения из фазы сборки
COPY --from=build /app/dist/alexandria-app/ .

EXPOSE 4200
