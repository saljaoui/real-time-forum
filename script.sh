#!/bin/sh
echo "---------------------> build image name forum"
docker build -t forum .
docker images

echo "---------------------> build container and run name forumcon"
docker container run -p 3333:3333 --detach --name forumcon forum
docker ps -a

echo "---------------------> clean up unused images."
docker image prune -a -f