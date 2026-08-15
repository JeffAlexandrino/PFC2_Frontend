FROM node:20.18.0 AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY public public
COPY src src
COPY tsconfig.json tsconfig.json
COPY .env .env

RUN yarn build

FROM nginx

# Copying built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copying our nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf