FROM golang:1.23.2-alpine

WORKDIR /app

RUN apk update && apk add --no-cache \
bash \
build-base \
sqlite-dev \
gcc \
libc-dev \
&& rm -rf /var/cache/apk/*

COPY . .
RUN go mod download
WORKDIR /app/backend/cmd

# Build the Go application
RUN go build -o /app/ourForum 
 

EXPOSE 8080
CMD ["/app/ourForum"]