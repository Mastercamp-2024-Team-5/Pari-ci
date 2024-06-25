# Rust base image
FROM rust:latest AS builder

# Install nightly toolchain
RUN rustup toolchain install nightly

# Set the nightly toolchain as default
RUN rustup default nightly

# working directory
WORKDIR /usr/src/app

# Copy the code
COPY . .

# Build the application
RUN cargo build --release

# Use a minimal image to run the built application
FROM debian:buster-slim

# Install necessary dependencies
RUN apt-get update && apt-get install -y libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy the built application from the builder image
COPY --from=builder /usr/src/app/target/release/citymapper-server /usr/local/bin/citymapper-server

# Set the startup command
CMD ["citymapper-server"]
