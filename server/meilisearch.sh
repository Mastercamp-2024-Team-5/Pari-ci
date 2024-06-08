# check if meilisearch is installed in current directory
if [ -f "./meilisearch" ]; then
  echo "Meilisearch is already installed in the current directory"
# else install meilisearch
else
  echo "Installing Meilisearch in the current directory"
  curl -L https://install.meilisearch.com | sh
fi

# Run meilisearch
./meilisearch --master-key="disregard-shingle-steadier-nuclear" --http-addr 'localhost:7700'
