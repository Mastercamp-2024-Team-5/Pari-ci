# Pari'ci

Pari'ci is an application designed to optimize travel times within the Parisian transport network. By optimizing travel times, the application helps reduce the carbon footprint associated with daily commutes.

## Table of Contents

- [Pari'ci](#parici)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Version 1](#version-1)
    - [Version 2](#version-2)
    - [Version 3](#version-3)
    - [Version 3 + Bonus](#version-3--bonus)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Setup and Installation](#setup-and-installation)
    - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
  - [Contributing](#contributing)
  - [License](#license)

## Features

### Version 1

- Calculate and display the shortest route.
- Display a network tree structure.
- Test network connectivity.

### Version 2

- Utilize up-to-date 2024 network data.

### Version 3

- Handle precise departure times and transfer times.
- Provide enhanced user interface elements for schedule display.

### Version 3 + Bonus

- Include RER lines in route calculations.
- Allow users to specify an arrival time.
- Display accessibility information for stations.

## Tech Stack

### Frontend

- Vite
- React
- TypeScript

### Backend

- Rust
- PostgreSQL
- Docker

## Setup and Installation

### Prerequisites

- Node.js
- Rust
- Docker
- PostgreSQL

### Backend Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/citymapper.git
   cd server
   ```

2. Configure the database with Rust Diesel:

   ```sh
   diesel setup
   diesel migration run
   cargo run --bin setup_db AddAll
   cargo run --bin setup_meilisearch
   ```

3. Build and run the backend:
   ```sh
   bash meilisearch.sh
   cargo run
   ```

### Frontend Setup

1. Navigate to the frontend directory and install dependencies:

   ```sh
   cd client
   npm install
   ```

2. Start the frontend development server:
   ```sh
   npm run dev
   ```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
