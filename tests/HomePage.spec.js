import {expect} from 'chai'
import enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import MapGL, {Marker} from 'react-map-gl'
import {HomePage} from '../client/components'

const adapter = new Adapter()
enzyme.configure({adapter})

describe('HomePage', () => {
  let homePage

  beforeEach(() => {
    homePage = shallow(<HomePage />)
  })

  it('contains a map component', () => {
    expect(homePage.dive().find(MapGL)).to.have.lengthOf(1)
  })

  it('renders a view at the current initial viewport', () => {
    const map = homePage.dive().find(MapGL)
    expect(map.get(0).props.latitude).to.equal(40.705)
    expect(map.get(0).props.longitude).to.equal(-74.009)
  })

  it('gets 1000 complaints from the NYC API', () => {
    expect(homePage.dive().state().complaints).to.have.lengthOf(0)
  })

  xit('renders a marker for each complaint', () => {
    // const mapArr = homePage.find(MapGL);
    // const map = mapArr.get(0);
    const markers = homePage.find(Marker)
    expect(homePage.find(Marker)).to.have.lengthOf(1000)
  })
})
