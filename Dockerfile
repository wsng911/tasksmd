FROM node:18-alpine AS build-stage

WORKDIR /app

RUN apk add --no-cache git && \
    git config --global user.email "dev@example.com" && \
    git config --global user.name "dev"

COPY frontend/ ./frontend/
COPY backend/ ./backend/
COPY entrypoint.sh ./

RUN git init && git add -A && git commit -m "init" || true

WORKDIR /app/frontend

RUN if [ ! -d "src/components/Stacks-Editor/.git" ]; then \
      rm -rf src/components/Stacks-Editor && \
      git clone https://github.com/BaldissaraMatheus/Stacks-Editor src/components/Stacks-Editor; \
    fi && \
    cd src/components/Stacks-Editor && npm ci --no-audit

RUN npm ci --no-audit --omit=dev

WORKDIR /app/backend
RUN npm ci --no-audit

FROM alpine:latest

WORKDIR /api

RUN apk add --no-cache nodejs npm git && \
    git config --global user.email "dev@example.com" && \
    git config --global user.name "dev"

COPY --from=build-stage /app/frontend /app
COPY --from=build-stage /app/backend /api/
COPY --from=build-stage /app/entrypoint.sh /api/entrypoint.sh

RUN mkdir -p /tasks /config

VOLUME /tasks
VOLUME /config

EXPOSE 8080

ENTRYPOINT ["sh", "entrypoint.sh"]
