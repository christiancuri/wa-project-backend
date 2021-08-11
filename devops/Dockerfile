# Build Stage
FROM node:14 as BUILD
WORKDIR /app
COPY ../ /app
RUN yarn install
RUN yarn run build
RUN npm rebuild bcrypt --build-from-source


# Production Stage
FROM node:14-alpine
WORKDIR /app
COPY --from=BUILD /app /app
EXPOSE 8080
CMD ["yarn", "start"]
