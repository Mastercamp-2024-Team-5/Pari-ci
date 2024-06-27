# Rust base image
FROM rust:1.60 as builder

# Install nightly toolchain
RUN rustup toolchain install nightly

# Set the nightly toolchain as default
RUN rustup default nightly

RUN apt update
RUN apt install -y libpq-dev

# Install Diesel CLI
RUN cargo install diesel_cli --no-default-features --features postgres

# Working directory
WORKDIR /usr/src/app

# Copy the code
COPY . .

RUN cargo install --path .

EXPOSE 8000

CMD ["app"]