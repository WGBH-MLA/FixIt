import React from 'react'
import Modal from 'react-modal'
import { PopupCenter } from '../../helpers'
import { patchData } from '../../helpers'

class MenuFooter extends React.Component {
  constructor(){
    super()
    this.setModal = this.setModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.sharePopUp = this.sharePopUp.bind(this)
    this.pushComplete = this.pushComplete.bind(this)

    this.state = {
      modalOpen:false
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

  closeModal(){
    this.setState({modalOpen:false})
  }

  sharePopUp(url, id, ){
    PopupCenter(url, id, '600', '500')
  }

  pushComplete(){
    if(this.props.endOfRound) {
      let user = this.props.user,
      data ={
        "completed":this.props.endOfRound      
      }
      patchData(`/api/profile/${user}/completed/`, data)
      this.props.updateScore(this.props.gameScore)

    } else {
      return false
    }
  }

  componentDidMount(){
    this.pushComplete()
  }
  
  render(){
    return(
      <div className="share-block">
        <span className="social-label">Share:</span>
        <ul>
          <li>
            <button onClick={() => this.sharePopUp('https://www.facebook.com/sharer/sharer.php?u=http%3A//fixit.americanarchive.org/', 'Facebook_Share')}>
              <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 200 200">
                <path className="background" fill="#6d6e71" d="M100 0a100 100 0 1 0 100 100A100 100 0 0 0 100 0z"/>
                <path fill="#fff" d="M124.44 67.46H113.3c-4.44 0-5.37 1.86-5.37 6.55v10.3h16.5l-1.72 16.83h-14.75V160H83.17v-58.9h-16.5V84.3h16.5V64.86c0-14.88 7.68-22.65 25-22.65h16.27z"/>
              </svg>
            </button>
          </li>
          <li>
            <button onClick={() => this.sharePopUp("https://twitter.com/home?status=I'm%20helping%20make%20public%20media's%20archive%20accessible%20by%20playing%20%40amarchivepub's%20FIX%20IT%20game.%20Join%20me%3A%20http%3A//fixit.americanarchive.org%20%23fixitaapb", 'Twitter_Share')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                <path className="background" fill="#6d6e71" d="M100 0a100 100 0 1 0 100 100A100 100 0 0 0 100 0z"/>
                <path fill="#fff" d="M150.4 81.58c1.5 33.93-23.4 71.75-67.4 71.75a66.25 66.25 0 0 1-36.34-10.84 47.12 47.12 0 0 0 35.1-10 23.82 23.82 0 0 1-22.16-16.77 23.4 23.4 0 0 0 10.7-.4 24.07 24.07 0 0 1-19-24A23.35 23.35 0 0 0 62 94.4a24.4 24.4 0 0 1-7.34-32.2 66.93 66.93 0 0 0 48.87 25.2c-3.46-15.08 7.8-29.62 23.1-29.62a23.5 23.5 0 0 1 17.37 7.6 46.8 46.8 0 0 0 15-5.84 24.15 24.15 0 0 1-10.43 13.34 46.67 46.67 0 0 0 13.6-3.8 48.06 48.06 0 0 1-11.82 12.5z" className="cls-2"/>
              </svg>
            </button>        
          </li>
          <li>
            <button onClick={() => this.sharePopUp("https://www.linkedin.com/shareArticle?mini=true&url=http%3A//fixit.americanarchive.org/&title=FIX%20IT&summary=I'm%20helping%20make%20public%20media's%20archive%20accessible%20by%20playing%20%40amarchivepub's%20FIX%20IT%20game.%20Join%20me%3A%20http%3A//fixit.americanarchive.org%20%23fixitaapb&source=", 'Linkedin_Share')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                <circle className="background" fill="#6d6e71" cx="100" cy="100" r="100"/>
                <path fill="#fff" d="M50.37 79.5h22.38v72H50.37zm11.2-9.85a13 13 0 1 1 13-13 13 13 0 0 1-13 13zm95.03 81.85h-22.4v-35c0-8.34-.15-19.08-11.63-19.08-11.65 0-13.44 9.1-13.44 18.5v35.62H86.8v-72h21.46v9.84h.3c3-5.66 10.3-11.63 21.18-11.63 22.66 0 26.85 14.92 26.85 34.3z" className="cls-2"/>
              </svg>
            </button>
          </li>
        </ul>
        <a className="terms-link js-terms-link" onClick={() => this.setModal()} href="#js-terms-dialog">Terms of Use</a>
        <Modal
          isOpen={this.state.modalOpen}
          onRequestClose={this.closeModal}        
          contentLabel="Terms And Conditions"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h1>Terms and Conditions</h1>
          <button className='modal-close' onClick={this.closeModal}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
              <title>Close Modal</title>
              <path d="M403.1 108.9c-81.2-81.2-212.9-81.2-294.2 0s-81.2 212.9 0 294.2c81.2 81.2 212.9 81.2 294.2 0s81.2-213 0-294.2zm-12.3 281.9c-74.3 74.3-195.3 74.3-269.6 0-74.3-74.3-74.3-195.3 0-269.6s195.3-74.3 269.6 0c74.4 74.3 74.4 195.3 0 269.6z"/>
              <path d="M340.2 160l-84.4 84.2-84-83.8-11.8 11.8 84 83.8-84 83.8 11.8 11.8 84-83.8 84.4 84.2 11.8-11.8-84.4-84.2 84.4-84.2"/>
            </svg>
          </button>
          <p>THE FOLLOWING TERMS AND CONDITIONS GOVERN YOUR USE OF THE SITE. PLEASE READ THESE TERMS OF USE CAREFULLY BEFORE USING THIS SITE.</p>
          <p>WGBH Educational Foundation (“WGBH”), on behalf of the American Archive of Public Broadcasting, which is a collaboration between WGBH and the Library of Congress, has created and maintains this FIX IT website (the “Site”). This Site is governed by the <a href="http://americanarchive.org/legal/tou" target="_blank">Terms of Use</a> (the “Terms”) and <a href="http://americanarchive.org/legal/privacy" target="_blank">Privacy Policy</a> (the “Policy”) of the American Archive for Public Broadcasting located at <a href="http://americanarchive.org/" target="_blank">americanarchive.org</a>. By using the Site you agree to be bound by the Terms and Policy. If you do not agree to the Term and Policy you must exit the Site and you may not use the Site or any of its features. Your acceptance of the Terms upon your first visit to the Site constitutes acceptance to the Terms on all of your subsequent visits to the Site.</p>
          <p>In addition to the Terms and the Policy, the following additional terms shall apply to the Site (the “Supplemental Terms”). In the event of any conflict between the Supplemental Terms and the Terms or the Policy, then the Supplemental Terms shall take priority, with all other provisions of the Terms and the Policy remaining in full effect.</p>
          <h2>A. Registration</h2>
          <p>You accept all responsibility for the use of any third party login function or API that you use to register for the Site and consent to information sharing by and between the providers of such services and WGBH which may include your name and contact information. You are solely responsible for all activities that occur through your account. You further acknowledge that you may receive emails pertaining to promotional suggested topics for FIX IT games.</p>
          <h2>B. Restrictions on Use of Site and Content</h2>
          <ol>
            <li>You must be at least thirteen (13) years of age to register for the Site and to submit any User Generated Content (defined by the Terms and below).</li>
            <li>You agree that use of the Site’s features and transcription games results in the creation of derivative works and that all rights associated with such transcription and results of said games remains the sole property of WGBH, the contributing station, or other rights holder for the material being transcribed.</li>
          </ol>
          <h2>C. User Generated Content (UGC):</h2>
          <ol>
            <li>You acknowledge that WGBH, the contributing station, or other rights holder for the material being transcribed as determined by WGBH, is the owner of all content generated through your use of the transcription games located on the site (“User Generated Content” or “UGC”) and that you may not control WGBH’s use of the content. WGBH is not obligated to use your UGC.</li>
            <li>You acknowledge that WGBH assumes no responsibility or liability arising from UGC that unreasonably differs from the source material, or for any error, defamation, libel, omission, obscenity, danger or inaccuracy contained in the same.</li>
            <li>You agree to use reasonable effort to ensure accuracy in your use of the transcription games which shall include utilizing the provided instructions for the same, and shall not use the games and UGC as an avenue to engage in any behavior which may be off-topic, contains personal attacks or expletives or is otherwise abusive, threatening, unlawful, harassing, discriminatory, libelous, obscene, false, pornographic, that infringes on the rights of a third party, or as a means of advertising or promoting any off topic matter.</li>
          </ol>
          <h2>D. Links to Third Party Sites </h2>
          <p>This site contains links to affiliated and unaffiliated websites. Such sites are subject to their own terms and conditions. Please review the terms and conditions specific to each website that you intend to make use of and make sure you comply with the applicable rules. You agree that WGBH shall have no liability for damaged, broken, or misleading links. Links are provided for convenience only and WGBH makes no representation or warranty and bears no responsibility for accuracy or content of any externally linked site. Your use of such sites is at your sole risk.</p>          
        </Modal>        
      </div>   
    )
  }
}

export default MenuFooter