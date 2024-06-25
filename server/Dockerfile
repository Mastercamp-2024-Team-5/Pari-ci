# Rust base image
FROM rust:1.60 as builder

# Install nightly toolchain
RUN rustup toolchain install nightly

# Set the nightly toolchain as default
RUN rustup default nightly

# Install Diesel CLI
RUN cargo install diesel_cli --no-default-features --features postgres

# Working directory
WORKDIR /usr/src/app

# Copy the code
COPY . .

# Build the application
RUN cargo build --release

# Use a Ubuntu base image to run the built application
FROM ubuntu:20.04

# Install necessary dependencies
RUN apt-get update && apt-get install -y libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

# Install PostgreSQL client (if needed for migrations)
RUN apt-get update && apt-get install -y postgresql-client

# Copy the built application from the builder image
COPY --from=builder /usr/src/app/target/release/citymapper-server /usr/local/bin/citymapper-server

# Set the startup command
CMD ["citymapper-server"]
