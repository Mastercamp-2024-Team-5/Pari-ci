# Rust base image
FROM rustlang/rust:nightly-slim as builder

RUN apt update && apt install -y libpq-dev postgresql-client

# Install Diesel CLI
RUN cargo install diesel_cli --no-default-features --features postgres

# Working directory
WORKDIR /usr/src/app

# Copy the code
COPY ./src/models /usr/src/app/src/models
COPY ./src/services /usr/src/app/src/services
COPY ./src/tools /usr/src/app/src/tools
COPY ./src/views /usr/src/app/src/views
COPY ./src/main.rs /usr/src/app/src/main.rs
COPY ./src/schema.rs /usr/src/app/src/schema.rs
COPY ./Cargo.toml /usr/src/app/Cargo.toml
COPY ./Cargo.lock /usr/src/app/Cargo.lock
COPY ./Rocket.toml /usr/src/app/Rocket.toml
COPY ./.env /usr/src/app/.env
COPY ./diesel.toml /usr/src/app/diesel.toml
COPY ./target /usr/src/app/target


# Install application dependencies and build
RUN cargo install --path .

EXPOSE 8000:8000

# Default command for this image
CMD ["./target/release/citymapper-server"]