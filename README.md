# Interview Scheduler

## LiveLink

https://stellar-ganache-14d867.netlify.app/
(may require refresh to load from api hosted on heroku)

Interview Scheduler App, users can view the current available and booked appointments through the course of the week(Monday to Friday). Users can:

- See current availability and book on available spots
- View/Modify/Delete existing appointments
- Data persists

### Stack

> React / Webpack / Babel / Axios / WebSockets / Heroku API

## Screen Shots

!["Screenshot of Day view"](docs/dayToggle.gif)

!["Screenshot of Add appointment"](docs/newappointment.gif)

!["Screenshot of Edit appointment"](docs/Editappointment.gif)

!["Screenshot Delete Appointment"](docs/deleteappointment.gif)

## Setup

Install dependencies with `npm install`.

## Dependencies
axios / classnames / normalize.css / react / react-dom / react-scripts

## Dev Dependencies
babel/core / storybook/addon-actions / storybook/addon-backgrounds / storybook/addon-links / storybook/addons / storybook/react / testing-library/jest-dom / testing-library/react / testing-library/react-hooks / babel-loader / cypress / node-sass / prop-types / react-test-renderer

## scheduler API
required api server available at https://github.com/kaj-kwok/scheduler-api

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
