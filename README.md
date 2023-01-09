# Bakri's NC Games API (BackEnd)

## Introduction

Hello and welcome to my NC Games API that I have created as part of my backend week-long project at Northcoders. Enclosed are step by step instructions on how to run and implement the code that I have built for this API. 

As a starting point, please feel free to explore all the possible endpoints on the API: https://bakrisncgames.onrender.com/api. Before accessing the link, I would recommend downloading the add-on JSON Formatter on Chrome https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en for better viewing purposes, or any other equivalent JSON formatting add-on for your specific browser.

## Summary of project

The purpose of this API was to access application data programmatically and to mimic the building of a real world backend service (such as reddit).

The aim of this specific project was to build a backend API for a game reviews database which would then provide the neccessary tools to the front end architecture that will be built in due course. The API gives users access to an array of game reviews and comments from people giving their opinion on said games.

## Technical details

All endpoints and corresponding functions were thoroughly tested using Test Driven Development (TDD) to create a robust infrastructure for the API. All code was constructed and organised using the Model View Controller software architectural pattern which allows for better division of labor and improved maintenance.

Tools used as part of this project:

- Node.js : For building fast and scalable network applications.
- Express : A Node.js web application framework, express provided me with the methods to specify what function is called for a particular HTTP verb ( GET , POST , SET , etc.) and URL pattern ("Route").
- PostgreSQL : Used as the primary data warehouse for the API database.
- Dotenv : Used to handle my environment variables and for extra security.
- Jest & Supertest : Used to write automated tests for my routes and endpoints.

---

## Initial Setup

Minimum versions of Node.js and Postgres needed to run this project,

```bash
Node: v19.0.0
Postgres: v12.12
```

1. Clone the repository to your local machine. To do this, open up your terminal and run this command:

```bash
git clone https://github.com/bakrikhalifa/BK-portfolio-project-nc_games.git
```

2. Now that you have cloned the repo, open it in your preferred code editor.

3. Next, install the dependencies required to run this project. To do this, run this command:

```bash
npm install
```

---

### Creating the .env files

Now that you have completed the inital setup, you will need to create the two environment variable files. To do this, complete the following steps precisely :bangbang:

1. Create a file called ".env.test" (without the quotations) and ONLY copy the following text to it:

```bash
PGDATABASE = nc_games_test;
```

2. Create another file called ".env.development" (without the quotations) and ONLY copy the following text to it:

```bash
PGDATABASE = nc_games;
```

## Scripts

Now that both .env files are created, we will need to run some scripts to get the code to run.

1. Run this command to create the databases on your machine:

```bash
node run setup-dbs
```

2. You will now need to seed the databases by running this command:

```bash
node run seed
```

3. The final step now is to check if everything was set up correctly. To do this, run this command and watch those green ticks come in!

```bash
npm test
```

If all the tests have passed :white_check_mark:, congragulations! You have succesfully completed the setup. :partying_face:	:tada:

Thank you so much to all the tutors at Northcoders who have helped during the proccess of building this project. 
