# Citymapper

Citymapper is an application designed to optimize travel times within the Parisian transport network. This project focuses on reducing CO2 emissions by providing the most efficient routes for users, leveraging advanced algorithms and modern web technologies.

## TODO

- [ ] Implement route calculation algorithm
- [ ] Write Models
- [ ] Write Controllers
- [ ] Write Services
- [ ] Write Repositories
- [ ] Write records / dtos / mappers
- [ ] Finish MVP
- [ ] Implement Mobile First Frontend w/ React or Angular
- [ ] Use Axios
- [ ] Improve UI/UX design

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

The primary objective of Citymapper is to provide an efficient route planning solution for users in Paris. By optimizing travel times, the application helps reduce the carbon footprint associated with daily commutes.

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
- TailwindCSS

### Backend

- Java 22
- Spring Boot 3.3.0
- PostgreSQL
- Docker

## Setup and Installation

### Prerequisites

- Node.js
- Java 22
- Docker
- PostgreSQL

### Backend Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/citymapper.git
   cd server
   ```

2. Configure the database in `src/main/resources/application.properties`:

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/citymapper
   spring.datasource.username=yourusername
   spring.datasource.password=yourpassword
   spring.jpa.hibernate.ddl-auto=update
   ```

3. Build and run the backend:
   ```sh
   ./mvn spring-boot:run
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
