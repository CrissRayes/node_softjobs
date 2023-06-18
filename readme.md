# Login API

## Description

This is an authentication and authorization project which use node and express for creating and managing users, as well as allow the users to login and get information about their profile.
Users are stored in a postgres database and the passwords are hashed using bcrypt.
For authenticate and authorize users, JSON Web Tokens are used.

### Prerequisites

Before running the project, make sure you have the following installed:

- Node.js
- Yarn

### Installation

1. Clone the repository
2. Navigate to the project directory.
3. Install the dependencies by running the following command:

```
$ yarn install
```

### Setup

1. Create a .env file in the root directory of the project.
2. Add the required environment variables in the .env file. For example:

```
JWT_SECRET=your_secret
PORT=3000
```

Make sure to replace the values with your own.

### Usage

1. Start the server by running the following command:

```
$ yarn start
```

2. The server will start running on the port specified in the .env file or on port 3000 by default.
3. You can use tools as Postman to test the endpoints.

### Endpoints

- **POST /usuarios** - Create a new user. JSON object is required in the request body with the following properties **email**, **password**, **rol** y **lenguaje**.
- **POST /login** - Login with an existing user. JSON object is required in the request body with the following properties **email** y **password**.
- **GET /usuarios** - Get the information of the logged in user. The token is required in the Authorization header.

### Eslint and Prettier

For linting and formatting the code, Eslint and Prettier are used. The configuration files are included in the project.

### Contributing

If you wish to contribute to this project, feel free to make a fork and submit a pull request.

### Author

This project was created by me, 🤓 **Cristian Ramírez**.
