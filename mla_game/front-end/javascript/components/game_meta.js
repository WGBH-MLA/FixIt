import React from 'react'

class GameMeta extends React.Component {
  
  render(){
    const {meta, aapb_link} = this.props;
    return (
      <dl>
        <dt><em>Source Record:</em></dt>
        <dd className="delta">{meta.program_title}</dd>
        <dd className="delta">{meta.series}</dd>
        <dd className="delta">Station Name ???</dd>
        <dd className="delta">{meta.broadcast_date}</dd>
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