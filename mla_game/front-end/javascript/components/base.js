import React from 'react'
import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import LoadingScreen from './partials/loading_screen'
import MainNav from './partials/main_nav'
import { ResponsiveComponent } from 'react-responsive-component'

import Modal from 'react-modal'

class Base extends React.Component {

  constructor(){
    super()
    this.closeModal = this.closeModal.bind(this)
    this.setModal = this.setModal.bind(this)
    this.toggleNav = this.toggleNav.bind(this)
    this.setNavState = this.setNavState.bind(this)

    this.state = {
      modalOpen:false,
      navOpen:true
    }
  }

  setModal(){
    let open = this.state.modalOpen
    if(open) {
      this.setState({modalOpen:false})
    } else {
      this.setState({modalOpen:true})
    }
  }

  toggleNav(){
    let open = this.state.navOpen
    if(open) {
      this.setState({navOpen:false})
    } else {
      this.setState({navOpen:true})
    }
  }

  setNavState(state){
    this.setState({navOpen:state})
  }

  closeModal(){
    this.setState({modalOpen:false})
  }

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
            <div className="grid">
              <h1 className='game-title'>
                <a className='aapb-link' target="_blank" href="http://americanarchive.org/"><span className='aapb-logo'><span className="assistive-text"><abbr title="American Archive of Public Broadcasting">AAPB Logo</abbr></span></span></a>
                <Link to='/' onlyActiveOnIndex><span className="beta-tag">FIX IT</span></Link>
                <button className="info-button" onClick={() => this.setModal()}>
                  <svg className='nav-icon' xmlns="http://www.w3.org/2000/svg" viewBox="10.6 100.6 590.8 590.8">
                    <path d="M306 691.4c-78.904 0-153.085-30.727-208.88-86.52C41.328 549.085 10.6 474.903 10.6 396s30.727-153.085 86.52-208.88C152.916 131.328 227.097 100.6 306 100.6s153.086 30.727 208.88 86.52C570.674 242.916 601.4 317.097 601.4 396s-30.727 153.086-86.52 208.88S384.903 691.4 306 691.4zm0-550.8c-68.22 0-132.356 26.566-180.595 74.805C77.167 263.645 50.6 327.78 50.6 396s26.566 132.356 74.805 180.596C173.645 624.834 237.78 651.4 306 651.4s132.356-26.566 180.596-74.805C534.834 528.355 561.4 464.22 561.4 396s-26.566-132.356-74.805-180.595C438.355 167.167 374.22 140.6 306 140.6z"/>
                    <path d="M277.848 374.58h67.32v185.13h-67.32z"/>
                    <circle cx="311.508" cy="290.736" r="45.9"/>
                  </svg>
                </button>
              </h1>

              <ResponsiveComponent query="only screen and (max-width: 68.75em)">
                <button className='dropDown' onClick={() => this.toggleNav()}>
                  {this.state.navOpen ? 'Close' : 'Menu' }
                </button>
                <MainNav 
                  setNavState={this.setNavState}
                  version={'dropDownMenu'}
                  navOpen={this.state.navOpen}
                />
              </ResponsiveComponent>

              <ResponsiveComponent query="only screen and (min-width: 68.75em)">
                <MainNav
                  setNavState={this.setNavState}
                  version={'staticMenu'}
                  navOpen={this.state.navOpen}
                />
              </ResponsiveComponent>
              <div className="score-container">
                <ReactCSSTransitionGroup 
                  component="span"
                  className="score delta"
                  transitionName="score"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={500}
                >
                  <span key={this.props.gameScores.total_score}>{this.props.gameScores.total_score}</span>
                </ReactCSSTransitionGroup>
              </div>
            </div>
          </header>
          {React.cloneElement(this.props.children, this.props)}
          <div>
          <Modal
            isOpen={this.state.modalOpen}
            onRequestClose={this.closeModal}        
            contentLabel="Game Information"
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            <button className='modal-close' onClick={this.closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                <title>Close Modal</title>
                <path d="M403.1 108.9c-81.2-81.2-212.9-81.2-294.2 0s-81.2 212.9 0 294.2c81.2 81.2 212.9 81.2 294.2 0s81.2-213 0-294.2zm-12.3 281.9c-74.3 74.3-195.3 74.3-269.6 0-74.3-74.3-74.3-195.3 0-269.6s195.3-74.3 269.6 0c74.4 74.3 74.4 195.3 0 269.6z"/>
                <path d="M340.2 160l-84.4 84.2-84-83.8-11.8 11.8 84 83.8-84 83.8 11.8 11.8 84-83.8 84.4 84.2 11.8-11.8-84.4-84.2 84.4-84.2"/>
              </svg>
            </button>
            <h1>About FIX IT</h1>
            <p>We need you to help ensure that public media remains accessible&mdash;not just today's broadcasts, but the archive all the way back to the beginning.</p>
            <p>After a brief moment on the air, most public broadcasting programs are filed away and languish on shelves, sometimes for decades. The American Archive of Public Broadcasting (AAPB), a collaboration between public media powerhouse WGBH and the Library of Congress, believes this treasure trove of public television and radio programs should be preserved and made available to the American people. For the past 4 years, we've been hard at work, digitizing thousands of broadcast hours from public media's 60+ year legacy, to provide public access to this rich and colorful history, and preserve it for future generations at the Library of Congress. And now, we need your help to make the content in this deep archive easier to search and find.</p>
            <p>With funding from the Institute of Museum and Library Services, the AAPB has launched FIX IT, an online game that allows people like you to assist professional archivists in identifying and correcting errors in our machine-generated transcripts. FIX IT players will have exclusive access to historic content and long-lost interviews. You could be the one to make sure that political leaders like John F. Kennedy and Ronald Reagan, civil rights heroes such as Martin Luther King, Jr. and Nelson Mandela, or iconic writers such as Eudora Welty and Simone de Beauvoir are accurately identified for posterity. You can rack up points in any of three challenge areas:  error identification, error correction, or validation of other players' corrections. The more you play, the more points you accumulate. You can choose areas of particular interest to you, or you can direct your efforts toward preserving the unique broadcasting history of your station or state. You even can track your progress against other players.</p>
            <p>Help us preserve history for future generations. Your corrections will be made available in public media's largest digital archive at <a href="http://americanarchive.org" target="_blank">americanarchive.org</a></p>
            <h2>About the AAPB</h2>
            <p>The American Archive of Public Broadcasting (AAPB) is a collaboration between the Library of Congress and the WGBH Educational Foundation to coordinate a national effort to preserve at-risk public media before its content is lost to posterity and provide a central web portal for access to the unique programming that public stations have aired over the past 60 years. To date, over 40,000 hours of television and radio programming contributed by more than 100 public media organizations and archives across the United States have been digitized for long-term preservation and access. The entire collection is available on location at WGBH and the Library of Congress, and more than 18,000 programs are available online at <a href="americanarchive.org" target="_blank" >americanarchive.org</a>.</p>
            <h2>About IMLS</h2>
            <p>This project was made possible in part by the Institute of Museum and Library Services [IMLS Grant No. LG-71-15-0208-15]. The Institute of Museum and Library Services is celebrating its 20th Anniversary. IMLS is the primary source of federal support for the nation's 123,000 libraries and 35,000 museums. Our mission has been to inspire libraries and museums to advance innovation, lifelong learning, and cultural and civic engagement. For the past 20 years, our grant making, policy development, and research has helped libraries and museums deliver valuable services that make it possible for communities and individuals to thrive. To learn more, visit <a href="http://www.imls.gov" target="_blank">www.imls.gov</a> and follow us on <a href="https://www.facebook.com/USIMLS" target="_blank">Facebook</a>, <a href="https://twitter.com/us_imls" target="_blank">Twitter</a> and  <a href="https://www.instagram.com/us_imls/" target="_blank">Instagram</a>.</p>
            <p>The views, findings, conclusions or recommendations expressed in this website do not necessarily represent those of the Institute of Museum and Library Services.</p>
          </Modal>
          </div>
        </div>

      )
    }
  }
}

export default Base;