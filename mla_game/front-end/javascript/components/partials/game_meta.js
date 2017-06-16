import React from 'react'

class GameMeta extends React.Component {

  constructor(){
    super()
  }

  render(){
    const {meta, aapb_link, sources } = this.props;
    let noData = meta === null,
        program,
        series,
        station,
        broadcastDate,
        transcript_sources
        

      if(!noData) {
        program = meta.program_title
        series = meta.series
        station = meta.station_name
        broadcastDate = meta.broadcast_date
        transcript_sources = sources.map((index, key) => {
          return(
            <dd className="delta" key={key}>{index.source}</dd>
          )
        })
      }

    
    return (
      <dl>
        <dt><em>Source Record:</em></dt>
        {transcript_sources}
        <dd className="delta">{program}</dd>
        <dd className="delta">{series}</dd>
        <dd className="delta">{station}</dd>
        <dd className="delta">{broadcastDate}</dd>
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