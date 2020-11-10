# build stage
FROM node:12-slim as build-stage
WORKDIR /kuma-gui

# install yarn dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# build frontend assets
RUN yarn build:dev

# production stage
FROM nginx:alpine
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /kuma-gui/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]