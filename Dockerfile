# Dockerfile


FROM node:16.13.0 as builder
# create destination directory
WORKDIR /app
COPY . .
RUN yarn install \
    --prefer-offline \
    --frozen-lockfile \
    --non-interactive \
    --production=false
# RUN npm run build

RUN rm -rf node_modules && \
    yarn install \
    --prefer-offline \
    --pure-lockfile \
    --non-interactive \
    --production=true
# copy the app, note .dockerignore
FROM node:16.13.0
WORKDIR /app
COPY --from=builder /app  .
ENV HOST 0.0.0.0
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_LOG=stdout

EXPOSE 3000
CMD [ "yarn", "start" ]
