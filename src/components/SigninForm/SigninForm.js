import React, {Component} from 'react'

class SigninForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
    }
  }

  onEmailChange = (event) => {
    this.setState({email: event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({password: event.target.value})
  }

  onSubmitClick = () => {
    const user = {
      email: this.state.email,
      password: this.state.password,
    }
    fetch('http://localhost:3003/signin', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user)
    })
    .then(resp => resp.json())
    .then(data => {
      console.log(data)
      if(data.id) {
        this.props.loadUser(data)
        this.props.onRouteChange('home')
      } else {
        this.props.onRouteChange('signin')
      }
    })
    .catch(err => {
      console.log(err)
      this.props.onRouteChange('signin')
    })
  }
  render () {
    const {onRouteChange} = this.props
    return (
      <article className="br3 shadow-5 ba b--black-10 mv4 w-100 w-50-m w-25-l mw7 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_in" className="ba b--transparent ph0 mh0">
              <legend className="f3 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input
                  onChange={this.onEmailChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input
                  onChange={this.onPasswordChange}
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitClick}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
            <div className="lh-copy mt3">
              <p className="f6 link dim black db pointer" onClick={() => onRouteChange('register')}>Register</p>
            </div>
          </div>
        </main>
      </article>
    )
  }
}

export default SigninForm;
