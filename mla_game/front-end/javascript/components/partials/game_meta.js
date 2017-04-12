import React from 'react'

class GameMeta extends React.Component {

  constructor(){
    super();
    this._metaElement = this._metaElement.bind(this);
  }

  _metaElement(e) {
    if(e) {
      return(
        <dd className="delta">{e}</dd>
      )  
    } else{
      return
    }
  }

  render(){
    const {meta, aapb_link} = this.props;
    return (
      <dl>
        <dt><em>Source Record:</em></dt>
        {this._metaElement(meta.program_title)}
        {this._metaElement(meta.series)}
        {this._metaElement(meta.station_name)}
        {this._metaElement(meta.broadcast_date)}
        <dd className="delta">
          <a href={aapb_link} target="_blank">
            <svg className="aapb-link-icon" viewBox="0 0 200 200">
              <title>AAPB Link</title>
              <rect x="0" y="40.8" fill="#6D6E70" width="130.6" height="119"/>
              <polygon fill="#6D6E70" points="200,40.8 100.8,90.8 200,140"/>
            </svg>
          </a>
        </dd>
      </dl>
    )
  }
  
}
export default GameMeta;