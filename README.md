# Activicat-Project
My main project: a website with exercises to practice Catalan. You can sign up as student or teacher, or just practice. In progress: the graphic design is to redo and several things need to be polished. See it deployed [here](http://activicat.cat)

## Background
This started as the final project at IT Academy but, even after finishing my studies there, it is currently my main personal project and my will is to make it grow for a long time.

## Stack
Frontend: Angular, Typescript, ngBootstrap, Angular Material, SASS
Backend: NodeJS - Express (+ SQL + AWS: EC2, RDS, S3)

## Installing
1. Clone this repository https://github.com/roger-mir-min/Activicat-Project
2. Install node_modules with "npm i" command

# Frontend
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# Backend (API)

## Overview
This is an API built with Node.js and Express that connects to a MySQL database. It provides CRUD operations through various controllers. It also features image storage and retrieval from an AWS S3 bucket via the Img_upload controller.

## Installation
1. Clone this repository: `git clone (https://github.com/roger-mir-min/Activicat-Project.git)`
2. Navigate to the API directory: `cd Backend`
3. Start the API: `node index.js`

## Usage
After you've started the API, it can be accessed through `localhost:3306` on your local machine. Use the different routes provided by the controllers to interact with the database.

## API Documentation
This API consists of five main controllers:

- **Account**: Manages individual user information (create, delete, update user information except profile images) and authentication (login - signup).
- **Img_uploads**: Handles user profile images.
- **Exercises**: Fetches activities based on various criteria (scope, topic, id, etc.)
- **Deures_activitats (Homework_activities)**: Manages activities handled by users (activities carried out by students, homework set by teachers, etc.)
- **Groups**: Handles the creation and management of groups by teachers.

## License and Credit
This project is released under the GNU GPLv3 License. It was created by Roger Miret Minard in 2023.

## Copyright (C) [2023] [Roger Miret Minard]
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

## Contact
If you have any questions, feel free to reach out to me at r.mir.min@activicat.cat.
