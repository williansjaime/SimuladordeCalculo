FROM node:12.22.0-alpine AS base

WORKDIR /frontend

ENV PATH /frontend/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g @angular/cli@13.0.1

# add app
COPY . /frontend

FROM base as build-prod
RUN ng build --configuration production

FROM nginx:1.20.0-alpine AS nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-prod /frontend/dist/frontend /frontend

