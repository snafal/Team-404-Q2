# Spirit11 Fantasy Cricket

A fantasy cricket platform for the Inter-University Cricket Tournament, allowing users to create teams, manage budgets, and compete on the leaderboard.

## Table of Contents
- [Overview](#overview)
- [Guidelines for Stage 1](#guidelines-for-stage-1)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Running the Project](#running-the-project)
- [Admin Panel](#admin-panel)
- [User Interface](#user-interface)
- [Assumptions Made](#assumptions-made)
- [Additional Features](#additional-features)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

Spirit11 is a fantasy cricket platform where users can create their dream team for the Inter-University Cricket Tournament. Users can select players within a budget, view detailed player statistics, and compete with other users on the leaderboard.

## Guidelines for Stage 1

For Stage 1 of the project, the following requirements have been implemented:

- **Admin Panel**: Includes authentication, player management (CRUD operations), player statistics management, and tournament summary.
- **User Interface**: Includes authentication, player browsing, team selection, budget tracking, and leaderboard.
- **Data Management**: All players from the provided dataset are imported into the database.
- **Calculations**: Player points and values are calculated using the provided formulas.
- **Database**: MongoDB is used for data persistence.
- **Predefined User**: A specific user account with predefined credentials and team has been created.

## Features

### Admin Features
- Admin authentication
- Player management (CRUD operations)
- Player statistics management
- Tournament summary with visualizations

### User Features
- User authentication (signup/login)
- Browse all players and view detailed statistics
- Select players for your fantasy team
- Track your budget and spending
- View your team composition
- Compete on the leaderboard

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **State Management**: React Context API
- **Data Visualization**: Recharts
- **Authentication**: Custom authentication system

## Setup and Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB installation)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/spirit11.git
   cd spirit11
...
```

2. Install dependencies:

```shellscript
npm install
# or
yarn install
```


3. Set up environment variables by creating a `.env.local` file in the root directory:

```plaintext
MONGODB_URI=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with your actual MongoDB connection string.




### Database Setup

#### Option 1: Using MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up a database user with password authentication
4. Configure network access (allow access from anywhere for development)
5. Get your connection string from the "Connect" button
6. Add your connection string to the `.env.local` file


#### Option 2: Using Local MongoDB

1. Install MongoDB Community Edition on your machine
2. Start the MongoDB service
3. Create a database named `spirit11`
4. Add your local connection string to the `.env.local` file


## Running the Project

1. Start the development server:

```shellscript
npm run dev
# or
yarn dev
```


2. Open [http://localhost:3000](http://localhost:3000) in your browser.
3. For admin access:

1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login with username: `admin` and password: `password`



4. For user access:

1. Go to [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
2. Login with the predefined account: username: `spiritx_2025` and password: `SpiritX@2025`
3. Or create a new account at [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)





## Admin Panel

The admin panel allows administrators to:

1. **Manage Players**: Add, edit, or delete players
2. **Update Player Statistics**: Modify player stats which automatically recalculates points and values
3. **View Tournament Summary**: See overall tournament statistics and visualizations


Access the admin panel at [http://localhost:3000/admin/login](http://localhost:3000/admin/login) with:

- Username: `admin`
- Password: `password`


## User Interface

The user interface allows users to:

1. **Browse Players**: View all players and their detailed statistics
2. **Select Team**: Choose players by category to build a fantasy team
3. **Manage Team**: View selected players and remove them if needed
4. **Track Budget**: Monitor budget allocation and spending
5. **View Leaderboard**: See how they rank against other users


## Assumptions Made

During development, the following assumptions were made:

1. **Player Data**: The provided CSV dataset contains all the necessary player information.
2. **Budget**: Each user starts with a budget of Rs. 9,000,000.
3. **Team Size**: A complete team consists of 11 players.
4. **Points Calculation**: Player points are calculated using the formula:

```plaintext
Player Points = ((Batting Strike Rate / 5) + (Batting Average × 0.8)) + ((500 / Bowling Strike Rate) + (140 / Economy Rate))
```


5. **Value Calculation**: Player value is calculated using the formula:

```plaintext
Value in Rupees = (9 × Points + 100) × 1000
```


6. **Leaderboard**: Only users with complete teams (11 players) appear on the leaderboard.
7. **Authentication**: For simplicity, passwords are stored in plain text. In a production environment, passwords would be hashed.


## Additional Features

Beyond the basic requirements, the following additional features have been implemented:

1. **Responsive Design**: The application is fully responsive and works on mobile, tablet, and desktop devices.
2. **Data Visualization**: Interactive charts and graphs for tournament statistics and budget tracking.
3. **Team Completeness Indicator**: Visual indicator showing progress toward completing a team.
4. **Role-Based Team Management**: Players are organized by their roles for easier team management.
5. **Real-time Points Calculation**: Player points and values are recalculated in real-time when stats are updated.


## Project Structure

```plaintext
spirit11/
├── app/                  # Next.js app directory
│   ├── admin/            # Admin panel pages
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard pages
│   └── page.tsx          # Landing page
├── components/           # React components
├── lib/                  # Utility functions and database operations
│   ├── data.ts           # Data processing and calculations
│   ├── db.ts             # Database operations
│   └── mongodb.ts        # MongoDB connection
├── public/               # Static assets
└── .env.local            # Environment variables
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration


### Players

- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get player by ID
- `POST /api/players` - Create new player (admin only)
- `PUT /api/players/:id` - Update player (admin only)
- `DELETE /api/players/:id` - Delete player (admin only)


### Player Statistics

- `GET /api/player-stats` - Get all player statistics
- `GET /api/player-stats/:id` - Get player statistics by player ID


### Users

- `PUT /api/users/:id` - Update user data (team, budget, etc.)


### Leaderboard

- `GET /api/leaderboard` - Get leaderboard data


## Deployment

The project can be deployed to Vercel with the following steps:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy the project


## Database Initialization

When the application starts for the first time, it automatically:

1. Imports all players from the provided CSV dataset
2. Calculates player points and values using the specified formulas
3. Creates the required user account with the predefined team
4. Sets up the necessary collections in MongoDB


No manual database setup is required beyond providing the MongoDB connection string.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:

1. Verify your MongoDB connection string is correct
2. Ensure network access is properly configured in MongoDB Atlas
3. Check that your IP address is whitelisted in MongoDB Atlas



2. **Image Not Displaying**:

1. Ensure the image file exists in the correct location
2. Check for typos in the file path
3. Verify the file format is supported



3. **API Errors**:

1. Check the browser console for detailed error messages
2. Verify that the MongoDB connection is working
3. Ensure all required environment variables are set





### Getting Help

If you encounter any issues not covered in this README, please:

1. Check the console logs for error messages
2. Review the MongoDB Atlas logs if database-related
3. Create an issue in the GitHub repository with detailed information about the problem


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Data provided by the Inter-University Cricket Tournament
- UI components from shadcn/ui
- Icons from Lucide React


```plaintext

```
