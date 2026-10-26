# ---- Build stage ----
FROM golang:1.23-alpine AS build

# cgo toolchain for github.com/mattn/go-sqlite3
RUN apk add --no-cache build-base

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download

COPY backend ./backend
RUN CGO_ENABLED=1 GOOS=linux go build -ldflags="-s -w" -o /out/forum ./backend/cmd

# ---- Runtime stage ----
FROM alpine:3.20

# CA certificates are needed for the TLS connection to Turso
RUN apk add --no-cache ca-certificates

WORKDIR /app
COPY --from=build /out/forum /app/forum
COPY frontend /app/frontend
COPY backend/internal/database/database.sql /app/backend/internal/database/database.sql

# The app resolves frontend/ and database.sql relative to APP_ROOT
ENV APP_ROOT=/app
ENV PORT=3333
EXPOSE 3333

CMD ["/app/forum"]
