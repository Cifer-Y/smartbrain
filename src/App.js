import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import './App.css';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceDetectBox from './components/FaceDetectBox/FaceDetectBox';
import SigninForm from './components/SigninForm/SigninForm';
import SignupForm from './components/SignupForm/SignupForm';

const particleParams = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
}

const clarifaiApp = new Clarifai.App({
  apiKey: 'cf83d3f42aa4464d828b5f90064a9767'
})

class App extends Component {
  constructor() {
    super()
    this.state = {
      inputField: '',
      imgUrl: '',
      boxes: [],
      route: 'signin'
    }
  }

  onInputChange = (event) => {
    this.setState({inputField: event.target.value})
  }

  calculateFaceRegions = (response) => {
    const regions = response.outputs[0].data.regions.map(r => r.region_info.bounding_box)
    const img = document.getElementById('inputImg');
    const width = img.width;
    const height = img.height;
    const boxes = regions.map(region => {
      return {
        leftCol: width * region.left_col,
        topRow: height * region.top_row,
        rightCol: width - width * region.right_col,
        bottomRow: height - height * region.bottom_row
      }
    })

    this.setState({boxes: boxes})
  }

  onSubmitClick = () => {
    const {inputField} = this.state;
    this.setState({imgUrl:inputField})
    clarifaiApp.models
      .predict(Clarifai.FACE_DETECT_MODEL,inputField)
      .then(this.calculateFaceRegions)
      .catch(console.log)
  }

  onSignedIn = () => {
    this.setState({route: 'home'})
  }

  onSignedOut = () => {
    this.setState({route: 'signin'})
  }

  onRouteChange = (route) => {
    this.setState({route: route})
  }

  render() {
    const {route} = this.state
    return (
      <div className="App">
          <Particles className='particle' params={particleParams}/>
          <Navigation route={route} onRouteChange={this.onRouteChange}/>
            {
                route === 'home'
                  ?
                    <div>
                      <Logo />
                      <Rank />
                      <ImageLinkForm onInputChange={this.onInputChange} onSubmitClick={this.onSubmitClick} />
                      <FaceDetectBox imgUrl={this.state.imgUrl} boxes={this.state.boxes}/>
                    </div>
                  : (
                      route === 'signin'
                          ?
                            <SigninForm onRouteChange={this.onRouteChange}/>
                          : <SignupForm onRouteChange={this.onRouteChange}/>
                    )
            }


      </div>
    );
  }
}

export default App;
