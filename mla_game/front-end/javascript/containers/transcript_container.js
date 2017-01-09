import React from 'react'
import GameUi from '../components/game_component'
import axios from 'axios'

class RandTranscriptContainer extends React.Component {
  
  constructor(){
    super();
    this._getData = this._getData.bind(this); 
    this.state = {
      media_url: '',
      aapb_link:'',
      phrases: [],
      meta:''
    }
  }
  
  _getData() {
    let self = this;
    axios.get('/api/transcript/random/')
     .then(function(data) {
      data = data.data[0];
       self.setState({
        media_url: data.media_url,
        phrases: data.phrases,
        aapb_link:data.aapb_link,
        meta:data.metadata,
       })
    });
  }

  componentDidMount() {
    this._getData();
  }

  render() {
    return (
      <GameUi 
        phrases={this.state.phrases} 
        meta={this.state.meta} 
        media_url={this.state.media_url} 
        broadcast_date={this.state.broadcast_date}
        program_title={this.state.program_title} 
        aapb_link={this.state.aapb_link} 
        score={this.props.score}
        updateScore={this.props.updateScore}
      />
    )
  }
}

export default RandTranscriptContainer;