/* eslint-disable guard-for-in */
'use strict'

const db = require('../server/db')
const {Borough, Neighborhood, Complaint} = require('../server/db/models')
const axios = require('axios')

const getComplaints = async (neighborhoodObj, neighborhoodComplaints) => {
  // eslint-disable-next-line guard-for-in
  for (let neighborhood in neighborhoodObj.Manhattan) {
    neighborhoodComplaints.Manhattan[neighborhood] = []
    // We used our neighborhood object, populated with the rings for each neighborhood and searched NYCOpenData using "Within Polygon" search
    let complaintPromises = await Promise.all(
      neighborhoodObj.Manhattan[neighborhood].map(ring => {
        return axios.get(
          `https://data.cityofnewyork.us/resource/fhrw-4uyv.json?$where=within_polygon(location,'MULTIPOLYGON(((${ring})))')%20AND%20created_date%20%3E%272017-01-01%27&$$app_token=x6u5W0HJAQOT5KfvMPo8KBBvT&$limit=21000000`
        )
      })
    )

    complaintPromises.forEach(promise => {
      neighborhoodComplaints.Manhattan[
        neighborhood
      ] = neighborhoodComplaints.Manhattan[neighborhood].concat(promise.data)
    })
  }
}

const populateComplaints = async (neighborhoodComplaints, hoodLookUp) => {
  console.log('BEGUN POPULATING COMPLAINTS!')
  for (let borough in neighborhoodComplaints) {
    for (let neighborhood in neighborhoodComplaints[borough]) {
      await Promise.all(
        neighborhoodComplaints[borough][neighborhood].map(complaint => {
          return Complaint.create({
            created_date: complaint.created_date,
            closed_date: complaint.closed_date,
            complaint_type: complaint.complaint_type,
            descriptor: complaint.descriptor,
            resolution_description: complaint.resolution_description,
            incident_address: complaint.incident_address,
            incident_zip: complaint.incident_zip,
            latitude: Number(complaint.latitude),
            longitude: Number(complaint.longitude),
            neighborhoodId: hoodLookUp[neighborhood]
          })
        })
      )
    }
  }
}

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  try {
    //fetching neighborhood coordinates
    const {data} = await axios.get(
      'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nynta/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'
    )
    const neighborhoodObj = {}
    // Create a neighborhood object that has borough keys, each borough key is populated with neighborhood keys from arcGIS neighborhood objects with their rings arrays
    data.features.forEach(el => {
      el.geometry.rings.forEach(ring => {
        //change array of coordinate arrays to array of coordinate strings
        const arrStrings = ring.map(hood => hood.join(' '))
        //change array of coordinate strings into one long ring string
        const polygonString = arrStrings.join(', ')

        //if the Borough has not been added yet, add it with the first nieghborhood
        if (!neighborhoodObj[el.attributes.BoroName]) {
          neighborhoodObj[el.attributes.BoroName] = {
            [el.attributes.NTAName]: [polygonString]
          }
        } else if (
          //if the neighborhood is already there, push the polygon string in
          neighborhoodObj[el.attributes.BoroName][el.attributes.NTAName]
        ) {
          neighborhoodObj[el.attributes.BoroName][el.attributes.NTAName].push(
            polygonString
          )
        } else {
          //if neighborhood is not there, add the neighborhood and create the polygon array
          neighborhoodObj[el.attributes.BoroName][el.attributes.NTAName] = [
            polygonString
          ]
        }
      })
    })

    //fill the database with borough names and neighborhood names
    const hoodLookUp = {}
    for (let borough in neighborhoodObj) {
      if (neighborhoodObj.hasOwnProperty(borough)) {
        const createdBorough = await Borough.create({
          name: borough
        })
        for (let neighborhood in neighborhoodObj[borough]) {
          if (neighborhoodObj[borough].hasOwnProperty(neighborhood)) {
            const createdNeighborhood = await Neighborhood.create({
              name: neighborhood,
              boroughId: createdBorough.id
            })
            hoodLookUp[createdNeighborhood.name] = createdNeighborhood.id
          }
        }
      }
    }

    const neighborhoodComplaints = {}
    neighborhoodComplaints.Manhattan = {}

    //fills neighborhood complaints object with complaints
    await getComplaints(neighborhoodObj, neighborhoodComplaints)
    //populates database with complaints from complaints object
    await populateComplaints(neighborhoodComplaints, hoodLookUp)
  } catch (err) {
    console.error(err)
  }

  console.log(`seeded successfully`)
}

async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
