import React from 'react'
import { patchData } from '../../helpers'
import TopicsInput from './topics_input'
import SourcesInput from './sources_input'

class PreferencesForm extends React.Component {
  constructor(){
    super()
    this.changePreferences = this.changePreferences.bind(this)
    this.selectTopic = this.selectTopic.bind(this)
    this.selectSource = this.selectSource.bind(this)
    this.state = {
      sources:[],
      topics:[],
      saved:false
    }
  }


  selectTopic(pk){
    // reference state
    const topics = [...this.state.topics];
    let topicIsSet = topics.includes(pk)
    
    if(topicIsSet){
      let index = topics.indexOf(pk);
      topics.splice(index, 1);
      this.setState({topics:topics})
    } else {
      topics.push(pk)
      this.setState({topics:topics})
    }
  }

  selectSource(pk){
    // reference state
    const sources = [...this.state.sources];
    let sourceIsSet = sources.includes(pk)
    
    if(sourceIsSet){
      let index = sources.indexOf(pk);
      sources.splice(index, 1);
      this.setState({sources:sources})
    } else {
      sources.push(pk)
      this.setState({sources:sources})
    }
  }

  componentDidMount(){
    this.setState({
      topics:this.props.preferred_topics,
      sources:this.props.preferred_stations
    })
  }
  
  changePreferences(event){
    event.preventDefault();
    // profile to patch to
    let userPk = this.props.user
    let sourcesEmpty = this.state.sources.length === 0
    let topicsEmpty = this.state.topics.length === 0
    
    // objects preferences to patch
    let preferred_topics = {
      "preferred_topics":this.state.topics
    }
    let preferred_stations = {
      "preferred_stations":this.state.sources
    }
    
    if(topicsEmpty && !sourcesEmpty) {
      let data = {
        clear_topics:true,
        clear_stations:false
      }
      // clear topics if thery are empty
      patchData(`/api/profile/clear_preferences/${userPk}/`, data)
    }

    if(!topicsEmpty) {
      patchData(`/api/profile/${userPk}/`, preferred_topics)
    }
    
    if(sourcesEmpty && !topicsEmpty) {
      let data = {
        clear_topics:true,
        clear_stations:false
      }
      // clear stations if they are empty
      patchData(`/api/profile/clear_preferences/${userPk}/`, data)
    }
    
    if(!sourcesEmpty) {
      patchData(`/api/profile/${userPk}/`, preferred_stations).then(function(res){
        console.log(res)
      })
    }


    if(topicsEmpty && sourcesEmpty) {
      let data = {
        clear_topics:true,
        clear_stations:true
      }
      // clear stations if they are empty
      patchData(`/api/profile/clear_preferences/${userPk}/`, data)
    }


    if(!sourcesEmpty || !topicsEmpty) {
      // ui updates
      let self = this
      this.setState({saved:true})
      new Promise(function(resolve) {
        setTimeout(function() { 
          resolve(); 
        }, 1500)
      })
      .then(function() {
        self.setState({saved:false})
      })
    }
  }


  render(){
    const {source, topics} = this.props

    let topicOptions = topics.map((index, key) => {
      return(
        <TopicsInput 
          selectTopic={this.selectTopic}
          key={key} 
          pk={index.pk}
          topic={index.topic}
          topics={this.props.preferred_topics}
          stateTopics={this.state.topics}
        />
      )
    })

    let sources = source.map((index, key) => {
      return(
        <SourcesInput 
          selectSource={this.selectSource}
          key={key} 
          pk={index.pk}
          state={index.state}
          source={index.source}
          sources={this.props.preferred_stations}
          stateSources={this.state.sources}
        />
      )
    })


    return (
      <div className="preferences-form">
        <div className="grid">
          <p className='instructions'>You can customize the types of programs you interact with in FIX IT by selecting preferences. Choose Topics and/or Organizations and States you are interested in and click Save. FIX IT will show preference to programs that match your selections.</p>
        </div>
        <form className='grid' ref={(input) => this.preferencesForm = input } onSubmit={(event) => this.changePreferences(event)}>
          <fieldset className='topics-set'>
            <legend>Topic</legend>
            <div>
              {topicOptions}
            </div>
          </fieldset>
          <button type='submit'>Save</button>
          {this.state.saved ? (
            <span className="save-message">Preferences Saved</span>
          ) : (
            ''
          )}
          <fieldset className='sources-set'>
            <legend>Organization</legend>
            <div>
              {sources}
            </div>
          </fieldset>
          <button type='submit'>Save</button>
          {this.state.saved ? (
            <span className="save-message">Preferences Saved</span>
          ) : (
            ''
          )}          
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