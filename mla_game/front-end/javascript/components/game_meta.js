import React from 'react'

var GameMeta = React.createClass({
  render: function(){
    return (
      <dl className="game-meta">
        <dt><em>Source Record:</em></dt>
        <dd className="delta">{this.props.program_title}</dd>
        <dd className="delta">Station Name</dd>
        <dd className="delta">{this.props.broadcast_date}</dd>
        <dd className="delta">
          <a href={this.props.aapb_link}>
            <svg className="aapb-link-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <title>AAPB Link</title>
              <circle cx="25" cy="25" r="25"></circle>
            </svg>
          </a>
        </dd>
      </dl>
    )
  }
});
export default GameMeta;