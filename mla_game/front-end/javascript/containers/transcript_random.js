import React from 'react'
import TranscriptUI from '../components/transcript_component'

class RandTranscriptContainer extends React.Component {
  
  constructor(){
    super();
    this._getData = this._getData.bind(this); 
    this.state = {
      media_url: '',
      aapb_link:'',
      phrases: [],
      meta:'',
    }
  }
  
  _getData() {
    $.ajax({
      url: '/api/transcript/random/'
    })
    .then(function(data) {
      data = data[0];
      this.setState({
        media_url: data.media_url,
        phrases: data.phrases,
        aapb_link:data.aapb_link,
        meta:data.metadata
      });
    }.bind(this));
  }

  componentDidMount() {
    this._getData();
  }

  render() {
    return (
      <TranscriptUI phrases={this.state.phrases} meta={this.state.meta} media_url={this.state.media_url} broadcast_date={this.state.broadcast_date} program_title={this.state.program_title} aapb_link={this.state.aapb_link} />
    )
  }
}

export default RandTranscriptContainer;