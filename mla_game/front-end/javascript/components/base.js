import React from 'react'
import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { getUserEndpoint } from '../helpers'
import LoadingScreen from './partials/loading_screen'

class Base extends React.Component {
  
  componentWillMount(){
    this.props.fetchData()
  }
  
  render() {
    let loading = this.props.initialData.loading;
    if(loading) {
      return(
        <LoadingScreen />
      )
    } else {
      return(
        <div>
          <header className='app-header'>
            <div>
              <h1 className='game-title'><Link to='/' onlyActiveOnIndex>Fix It</Link></h1>
              <ReactCSSTransitionGroup 
                component="span"
                className="score delta"
                transitionName="score"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
              >
               <span key={this.props.gameScores.total_score}>{this.props.gameScores.total_score}</span>
              </ReactCSSTransitionGroup>

              <ul className='app-navigation'>
                <li><Link activeClassName="active" to="leaderboard">
                    <svg className='nav-icon' viewBox="0 0 200 200">
                      <title>Leader Board</title>
                      <rect x="11.4" y="56" width="24" height="144"/>
                      <rect x="113.5" y="40" width="24" height="160"/>
                      <rect x="62.4" y="0" width="24" height="200"/>
                      <rect x="164.6" y="80" width="24" height="120"/>
                    </svg>      
                  </Link>
                </li>
                <li><Link activeClassName="active" to="/" onlyActiveOnIndex>
                    <svg className='nav-icon' viewBox="0 0 200 200">
                      <title>Game Menu</title>
                      <path d="M100.5 60.9c14.4 0 26.1-11.7 26.1-26.1 0-14.4-11.7-26.1-26.1-26.1S74.4 20.4 74.4 34.8c0 14.4 11.7 26.1 26.1 26.1"/>
                      <path d="M100.5 63.6c-15.8 0-28.7-12.9-28.7-28.7 0-15.8 12.9-28.7 28.7-28.7 15.8 0 28.7 12.9 28.7 28.7 0 15.8-12.9 28.7-28.7 28.7zm0-52.2c-12.9 0-23.4 10.5-23.4 23.4 0 12.9 10.5 23.4 23.4 23.4s23.4-10.5 23.4-23.4c0-12.9-10.5-23.4-23.4-23.4zM28.5 190.2c14.4 0 26.1-11.7 26.1-26.1 0-14.4-11.7-26.1-26.1-26.1S2.4 149.7 2.4 164.1c0 14.4 11.7 26.1 26.1 26.1"/>
                      <path d="M28.5 192.8c-15.8 0-28.7-12.9-28.7-28.7s12.9-28.7 28.7-28.7c15.8 0 28.7 12.9 28.7 28.7s-12.9 28.7-28.7 28.7zm0-52.1c-12.9 0-23.4 10.5-23.4 23.4 0 12.9 10.5 23.4 23.4 23.4s23.4-10.5 23.4-23.4c0-12.9-10.5-23.4-23.4-23.4zM171.1 190.2c14.4 0 26.1-11.7 26.1-26.1 0-14.4-11.7-26.1-26.1-26.1-14.4 0-26.1 11.7-26.1 26.1 0 14.4 11.7 26.1 26.1 26.1"/>
                      <path d="M171.1 192.8c-15.8 0-28.7-12.9-28.7-28.7s12.9-28.7 28.7-28.7c15.8 0 28.7 12.9 28.7 28.7s-12.9 28.7-28.7 28.7zm0-52.1c-12.9 0-23.4 10.5-23.4 23.4 0 12.9 10.5 23.4 23.4 23.4s23.4-10.5 23.4-23.4c0-12.9-10.5-23.4-23.4-23.4zM70.3 160.9h59.9v16H70.3zM131.076 68.195l29.95 51.873-13.856 8-29.95-51.873zM73.24 68.215l13.857 8L57.14 128.09l-13.855-8.002z"/>
                    </svg>
                  </Link>
                </li>
                <li><Link activeClassName="active" to="preferences">
                  <svg className="nav-icon" viewBox="0 0 200 200">
                    <title>Preferences</title>
                    <path d="M134.6,115.1c5-4.6,9.4-10.2,12.8-16.5c5.5-10.2,8.4-22,8.4-34.2c0-16.9-5.6-32.8-15.6-44.9 C129.7,6.9,115.6,0,100.4,0S71.1,6.9,60.6,19.5c-10.1,12.1-15.6,28-15.6,44.9c0,12.1,2.9,24,8.4,34.2c3.4,6.4,7.8,12,12.8,16.5 c-11.4,5.5-22,14.9-30.7,27.5c-10.3,15-16.5,32.6-16.5,47.2c0,5.6,4.6,10.2,10.2,10.2h142.4c5.6,0,10.2-4.6,10.2-10.2 c0-14.6-6.2-32.2-16.5-47.2C156.7,130.1,146.1,120.6,134.6,115.1z M40.7,179.7c2-8.3,6-17.5,11.6-25.5 c8.8-12.8,19.7-21.1,30.9-23.5c4.7-1,8-5.1,8-9.9v-7.3c0-3.7-2-7-5.1-8.8c-12.6-7.2-20.7-22.9-20.7-40.2 c0-24.3,15.8-44.1,35.1-44.1s35.1,19.8,35.1,44.1c0,17.2-8.1,33-20.7,40.2c-3.2,1.8-5.1,5.2-5.1,8.8v7.3c0,4.8,3.3,8.9,8,9.9 c11.1,2.4,22.1,10.7,30.9,23.5c5.6,8.1,9.6,17.2,11.6,25.5H40.7z"/>
                  </svg>
                  </Link>
                </li>
              </ul>
            </div>
          </header>
          {React.cloneElement(this.props.children, this.props)}
        </div>
      )
    }
  }
}

export default Base;