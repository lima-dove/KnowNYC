// ATEMPT TO USE ITERATOR
const db = require('../server/db')
const {
  Neighborhood,
  Complaint,
  NeighborhoodAggregate
} = require('../server/db/models')
const axios = require('axios')

// Used the largest ring (with the most polygon points) to represent the neighborhood
const findMaxArray = nestedArray => {
  let maxArray = []
  let max = 0
  nestedArray.forEach(arr => {
    if (arr.length > max) {
      max = arr.length
      maxArray = arr
    }
  })
  return maxArray
}

// ITERATOR VARIABLES
let object = {}
let arrayOfHoodObjects = []
let complaintType = []
let complaintRow

// Recieve complaint types from all neighborhoods array, where each element is a neighborhood object with a complaints key
const complaintTypeIterator = {
  [Symbol.asyncIterator]: function() {
    let k = -1
    return {
      next: async function() {
        k++
        if (k < complaintType.length) {
          complaintRow = await NeighborhoodAggregate.create({
            neighborhoodId: object[complaintType[k]].neighborhoodId,
            complaint: complaintType[k],
            frequency: object[complaintType[k]].frequency
          })
          return {value: complaintRow.id, done: false}
        }
        return {value: k, done: true}
      }
    }
  }
}

const neighborhoodAggregateRowCreateIterator = {
  [Symbol.asyncIterator]: function() {
    let i = -1
    let hood
    let total = 0

    return {
      next: async function() {
        i++
        hood = arrayOfHoodObjects[i]
        if (i < arrayOfHoodObjects.length) {
          total = hood.complaints.length
          // Build a new neighborhood's object:
          object = {}
          for (let j = 0; j < total; j++) {
            // Check if the neighborhood's object already has this complaint type object:
            if (object.hasOwnProperty([hood.complaints[j].complaint_type])) {
              object[hood.complaints[j].complaint_type].frequency++ // If yes, increment the frequency
              // Else, make the single complaint-type aggregate object
            } else if (
              !object.hasOwnProperty([hood.complaints[j].complaint_type])
            ) {
              object[hood.complaints[j].complaint_type] = {
                // Populate it with initilized frequency and note the neighborhoodId
                frequency: 1,
                neighborhoodId: hood.id
              }
            }
          }

          await Neighborhood.update(
            // Add the total complaints for the neighborhood to the total_complaints column in the neighborhood model
            {total_complaints: total},
            {where: {id: hood.id}}
          )

          complaintType = new Set()
          for (let complaint in object) {
            if (object.hasOwnProperty(complaint)) {
              complaintType.add(complaint)
            }
          }
          complaintType = [...complaintType]
          for await (const complaintAggregate of complaintTypeIterator) {
            // console.log({complaintAggregate})
          }

          return {
            value: {
              complaintTypeLength: complaintType.length,
              neighborhoodId: complaintRow.dataValues.neighborhoodId,
              complaint: complaintRow.dataValues.complaint,
              frequency: complaintRow.dataValues.frequency
            },
            done: false
          }
        }
        return {
          value: `updated ${arrayOfHoodObjects[i - 1].id} with total: ${
            arrayOfHoodObjects[i - 1].complaints.length
          }`,
          done: true
        }
      }
    }
  }
}

const createAggregates = async () => {
  try {
    // Returns an array of neighborhood objects whose name key is the neighborhood name and whose complaints key is an array of complaints from that neighborhood
    arrayOfHoodObjects = await Neighborhood.findAll({
      where: {
        boroughId: 3
      },
      include: [
        {
          model: Complaint,
          as: 'complaints'
        }
      ]
    })

    for await (const row of neighborhoodAggregateRowCreateIterator) {
      // console.log({row})
    }
  } catch (err) {
    console.error(err)
  }
}

async function seed() {
  await db.sync()
  console.log('db synced!')

  try {
    const {data} = await axios.get(
      'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nynta/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'
    )
    const neighborhoodObj = {}
    // Each element is a neighborhood with an associated borough name, neighborhood name, and polygon array
    data.features.forEach(el => {
      el.geometry.rings.forEach(ring => {
        const arrStrings = ring.map(hood => hood.join(' '))
        // Three cases: New borough key, existing borough new neighborhood key, existing borough and neighborhood keys with new ring
        if (!neighborhoodObj[el.attributes.BoroName]) {
          neighborhoodObj[el.attributes.BoroName] = {
            [el.attributes.NTAName]: [arrStrings]
          }
        } else if (
          neighborhoodObj[el.attributes.BoroName][el.attributes.NTAName]
        ) {
          neighborhoodObj[el.attributes.BoroName][el.attributes.NTAName].push(
            arrStrings
          )
        } else {
          neighborhoodObj[el.attributes.BoroName][el.attributes.NTAName] = [
            arrStrings
          ]
        }
      })
    })

    // THIS ENDS UP POPULATING TOTALLY WITHOUT THE NEED FOR FOR.. OF ITERATION
    // eslint-disable-next-line guard-for-in
    for (let borough in neighborhoodObj) {
      // eslint-disable-next-line guard-for-in
      for (let hood in neighborhoodObj[borough]) {
        const hoodCoords = findMaxArray(neighborhoodObj[borough][hood])
        const hoodTotal = hoodCoords.reduce(
          (acc, el) => {
            const coordArr = el.split(' ')
            acc[0] += Number(coordArr[0])
            acc[1] += Number(coordArr[1])
            return acc
          },
          [0, 0]
        )
        const hoodAverage = [
          hoodTotal[0] / hoodCoords.length,
          hoodTotal[1] / hoodCoords.length
        ]

        await Neighborhood.update(
          {
            center_longitude: hoodAverage[0],
            center_latitude: hoodAverage[1]
          },
          {
            where: {
              name: hood
            }
          }
        )
      }
    }

    await createAggregates()

    console.log(`seeded successfully`)
  } catch (error) {
    console.log(error)
  }
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
