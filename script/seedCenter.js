const db = require('../server/db')
const {Neighborhood} = require('../server/db/models')
const axios = require('axios')

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

async function seed() {
  await db.sync()
  console.log('db synced!')

  try {
    const {data} = await axios.get(
      'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nynta/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'
    )
    const neighborhoodObj = {}

    data.features.forEach(el => {
      el.geometry.rings.forEach(ring => {
        const arrStrings = ring.map(hood => hood.join(' '))
        // const polygonString = arrStrings.join(', ')
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
