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
import Register from './components/Register/Register';

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
      route: 'signin',
      currentUser: null,
    }
  }

  onInputChange = (event) => {
    this.setState({inputField: event.target.value})
  }

  loadUser = (user) => {
    this.setState({currentUser: user})
  }

  logoutUser = () => {
    this.onRouteChange('signin')
    this.setState({
      inputField: '',
      imgUrl: '',
      boxes: [],
      route: 'signin',
      currentUser: null
    })
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
    const {inputField, currentUser} = this.state;
    this.setState({imgUrl:inputField})
    clarifaiApp.models
      .predict(Clarifai.FACE_DETECT_MODEL,inputField)
      .then(res => {
        this.calculateFaceRegions(res)
        fetch(`http://localhost:3003/users/${currentUser.id}/image`, {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
        })
        .then(resp => resp.json())
        .then(data => {
          this.setState({currentUser: data})
        })
        .catch(err => {
          console.log(err)
          this.props.onRouteChange('signin')
        })
      })
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
    const {route, currentUser} = this.state
    return (
      <div className="App">
          <Particles className='particle' params={particleParams}/>
          <Navigation route={route} logoutUser={this.logoutUser} onRouteChange={this.onRouteChange}/>
            {
                route === 'home'
                  ?
                    <div>
                      <Logo />
                      <Rank currentUser={currentUser}/>
                      <ImageLinkForm onInputChange={this.onInputChange} onSubmitClick={this.onSubmitClick} />
                      <FaceDetectBox imgUrl={this.state.imgUrl} boxes={this.state.boxes}/>
                    </div>
                  : (
                      route === 'signin'
                          ?
                            <SigninForm loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    )
            }


      </div>
    );
  }
}

export default App;
