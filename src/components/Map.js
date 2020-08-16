import React, { Component } from 'react';
import { VectorMap } from "react-jvectormap"
import { Grid, Segment } from 'semantic-ui-react'

const { getName } = require('country-list');

class Map extends Component {
  constructor() {
    super()
    this.state = {
      countryCodes: [],
      countryNames: [],
      data: {},
      color: '#48aeef'
    }
  }

  componentDidMount() {
    if (!localStorage.getItem('token')) {
      this.props.history.push('/login')
    }
  }

  handleClick = (e, code) => {
    const codes = this.state.countryCodes
    if (!codes.includes(code)) {
      this.setState(
        {
          countryCodes: [...codes, code]
        },
        () => this.getCountriesNamesList()
      )
    }
  }

  getCountriesNamesList = () => {
    const codes = this.state.countryCodes
    const list = codes.map(code => getName(code));
    this.setState(
      {
        countryNames: list
      },
      () => this.makeMapDataStructure()
    )
  }

  makeMapDataStructure = () => {
    const { countriesCodesArray } = this.state;
    let obj = {};
    //{CN: 5, MX: 5, TX: 5}
    countriesCodesArray.forEach(countryCode => (obj[countryCode] = 5));
    this.setState({
      data: obj
    });
  };

  render() {
    return (
      <Grid stackable divided columns={2} padded={true}>
        <Grid.Row stretched>
        <Grid.Column width={11}>
            <Segment>
              <VectorMap
                map={"world_mill"}
                backgroundColor={"transparent"}//change it to ocean blue: #0077be
                zoomOnScroll={true}
                panOnDrag={true}
                containerStyle={{
                  width: "100%",
                  height: "520px"
                }}
                onRegionClick={this.handleClick} //gets the country code
                containerClassName="map"
                regionStyle={{
                  initial: {
                    fill: "#e4e4e4",
                    "fill-opacity": 0.9,
                    stroke: "none",
                    "stroke-width": 0,
                    "stroke-opacity": 0
                  },
                  hover: {
                    "fill-opacity": 0.8,
                    cursor: "pointer"
                  },
                  selected: {
                    fill: "#2938bc" //color for the clicked country
                  },
                  selectedHover: {}
                }}
                regionsSelectable={true}
                series={{
                  regions: [
                    {
                      values: this.state.data, //this is your data
                      scale: ["#146804", "#ff0000"], //your color game's here
                      normalizeFunction: "polynomial"
                    }
                  ]
                }}
              />
            </Segment>
          </Grid.Column>
        <Grid.Column width={5}>
          <Segment>My Trips</Segment>
          <Segment>Top Trips</Segment>
        </Grid.Column>
        </Grid.Row>
        
      </Grid>
    )
  }
}

export default Map