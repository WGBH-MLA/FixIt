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
    }
  }

  
  render(){
    const {meta, aapb_link} = this.props;
    return (
      <dl>
        <dt><em>Source Record:</em></dt>
        {this._metaElement(meta.program_title)}
        {this._metaElement(meta.series )}
        {this._metaElement(meta.station_name )}
        {this._metaElement(meta.broadcast_date )}
        <dd className="delta">
          <a href={aapb_link}>
            <svg className="aapb-link-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <title>AAPB Link</title>
              <circle cx="25" cy="25" r="25"></circle>
            </svg>
          </a>
        </dd>
      </dl>
    )
  }
  
}
export default GameMeta;