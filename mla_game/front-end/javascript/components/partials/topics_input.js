import React from 'react'

class TopicsInput extends React.Component {

  constructor(){
    super()
    this.checkTopics =this.checkTopics.bind(this)
    this.toggleTopic =this.toggleTopic.bind(this)

    this.state = {
      checked:false
    }

  }

  toggleTopic(){
    const {pk, topics, topic, stateTopics} = this.props
    let topicIsSet = stateTopics.includes(pk)
    this.props.selectTopic(pk)  

    if(topicIsSet) {
      this.setState({checked:false})
    } else {
      this.setState({checked:true})
    }
  }

  checkTopics(){
    this.props.topics.map((index, elem) => {
      if(index === this.props.pk) {
        this.setState({
          checked:true
        })
      }
    })
  }
  
  componentDidMount(){
    this.checkTopics()
  }

  render(){
    const {pk, topic} = this.props
    return(
      <span className="topic">
        <label>
          <input id={pk} type="checkbox" onChange={ ()=> this.toggleTopic() } checked={this.state.checked}/>
          {topic}
        </label>
      </span>
    )
  }
}

TopicsInput.proptypes = {
  topic:React.PropTypes.string.isRequired,
  pk:React.PropTypes.string.isRequired,
  topics:React.PropTypes.array.isRequired,
  stateTopics:React.PropTypes.array.isRequired,
}

export default TopicsInput;