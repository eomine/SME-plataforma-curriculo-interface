FROM node:22-alpine as build

WORKDIR /app

COPY package.json npm-shrinkwrap.json .npmrc ./
RUN npm ci --no-audit --no-fund

COPY . ./
RUN npm run lint
RUN npm run build

FROM nginx:alpine
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
COPY --from=build /app/build /usr/share/nginx/html
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["/app/entrypoint.sh"]
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
