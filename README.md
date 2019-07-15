# KnowNYC:

www.knownyc.co

We leveraged New York City’s non-emergency public service hotline database to create a 311 data visualization map that allows  users to see all 311 incident reports within the borough of Manhattan since 2017.

Whether you’re a resident or prospective resident of Manhattan (or just curious) KnowNYC is arming you with the knowledge of official 311 incidents in your area.

We also allow you to interact with your community to lodge and resolve your own incidents or complaints.

## Navigating the site:

You start on Neighborhood View where each marker represents a neighborhood. When you click on a marker you can see the total complaints for the neighborhood as well as the top five complaints by frequency for that neighborhood. These are presented in two graphical formats: pie chart and bar graph.

When you zoom in to a certain level, you enter Address View where you can click Search This Area. Markers that represent individual addresses will populate within your viewing area. When you click on a marker it will show you the graphical representations of up to ten of the most frequent complaints specific to that address. When you scroll down the popup you can see all of this address’ complaint details. The complaints are available in three different views: all complaints, official 311 complaints, and user-generated complaints, all sorted by most recent first.

You can also directly search for an address, and if it has registered complaints, you will be ‘flown to’ that address and shown its info page.

While you can browse the map as a guest, as a logged in user you also have the option of setting a home address. This address will be associated with your user profile and you will be 'flown' directly to that address when you click on the airplane button on the sidebar.

Both guests and logged in users can submit their own complaints. A user can navigate to the user complaint section of the address view popup and click the add button to make a complaint. Upon submission, this complaint is visible in the user and all complaints view. Any users subscribed to this address will then receive an email notification about the new complaint. They can also resolve complaints by adding their own resolution descriptions.

## Technical challenges we faced: 

_Aggregating neighborhood data_
Our first challenge was to organize 1.2 million complaints, nearly 2GB worth of data, into neighborhoods and present them visually. For a comprehensive view, we decided to display each neighborhood’s aggregate data on the initial render. 
To do that we needed to combine the ArcGIS data, which has the latitude and longitude boundaries for each neighborhood, with the complaints from NYC OpenData (which each included a latitude and longitude of its own). (within polygon search)
By doing this we were able to make a neighborhood table in the database to associate each complaint with a neighborhood.

_Render Speeds of map markers_
Our next challenge was to optimize the render speeds of the markers. 
Instead of calculating the aggregate data every time we entered the neighborhood view, which interrupted the user experience, we decided to seed our database with this information so it was readily available on page load.

## Technologies:

Visualization: 
react-map-gl
D3
Material-UI

Data APIs: 
NYC OpenData
ArcGIS

Storing/accessing data:
Postgres
Sequelize

Email notification:
Nodemailer

Front-end:
React
Redux

## Future ideas:

Image uploads with complaints
Filtered searches
Expansion to the other four boroughs

## Running our app

Fork and clone the repository

Run npm install

Create two postgres databases: knownyc and knownyc-test

Run _npm test_ to run our unit tests

Run _npm run seed_ followed by _npm run seed-center_ to seed the database

_npm run start-dev_ runs the app in development mode. Open http://localhost:8080 to view it in the browser. Errors will be shown in your browser and code editor

You can view the deployed version of the app on: www.knownyc.co

Please note that you will need to first configure a new application with Heroku if you would like to launch a clone of this repository.
