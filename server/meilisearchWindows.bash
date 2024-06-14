# Fetch the latest version of Meilisearch image from DockerHub
docker pull getmeili/meilisearch:v1.8

# Launch Meilisearch in development mode with a master key
docker run -it --rm \
    -p 7700:7700 \
    -e MEILI_ENV='development' \
    -v $(pwd)/meili_data:/meili_data \
    getmeili/meilisearch:v1.8
# Use ${pwd} instead of $(pwd) in PowerShell

docker run -it --rm -p 7700:7700 -e MEILI_ENV='development' -v $(pwd)/meili_data:/meili_data getmeili/meilisearch:v1.8