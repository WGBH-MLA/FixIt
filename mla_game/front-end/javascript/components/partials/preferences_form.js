import React from 'react'
import { patchData } from '../../helpers'

class PreferencesForm extends React.Component {
  constructor(){
    super()
    this.changePreferences = this.changePreferences.bind(this)
    this.checkSources = this.checkSources.bind(this)
    this.checkTopics = this.checkTopics.bind(this)
  }

  componentDidMount(){
  }

  checkSources(pk) {

  }

  checkTopics(pk) {
    this.props.preferred_topics.map((index, key) => {
      if(index === pk) {
        return(
          <span>checked</span>
        )
      } else {
        return(
          <span>Not checked</span>
        )
      }
    })
  }


  
  changePreferences(event){
    event.preventDefault();
    // // create object and url for changeing username
    // let userPk = this.props.data.user[0].pk
    
    // let username = {
    //   "username":this.userform[0].value
    // }
    
    // // patch username and update in state
    // this.props.setUsername(this.userform[0].value)
    // patchData(`/api/profile/${userPk}/`, username)
  }


  render(){
    const {source, topics} = this.props

    let topicOptions = topics.map((index, key) => {
      return(
        <span className="topic" key={key}>
          {this.checkTopics(index.pk)}
          <label>
            <input id={index.pk} type="checkbox"/>
            {index.topic}
          </label>
        </span>
      )
    })

    let sources = source.map((index, key) => {
      return(
        <span className='source' key={key}>
          <label>
            <input className="checkbox" id={index.pk} type="checkbox"/>
            <span className="state">{index.state}</span>
            <span className="name">{index.source}</span>
          </label>
        </span>
      )
    })


    return (
      <div className="preferences-form">
        <form className='grid' ref={(input) => this.preferencesForm = input } onSubmit={(event) => this.changePreferences(event)}>
          <fieldset className='topics-set'>
            <legend>Topic</legend>
            <div>
              {topicOptions}
            </div>
          </fieldset>
          <fieldset className='sources-set'>
            <legend>Organization</legend>
            <div>
              {sources}
            </div>
          </fieldset>
          <button type='submit'>Save</button>
        </form>
      </div>
    )
  }
}

PreferencesForm.proptypes = {
  topics:React.PropTypes.object.isRequired,
  source:React.PropTypes.object.isRequired,
}

export default PreferencesForm;