import React from 'react'

class LeaderList extends React.Component {
  render(){
    const { list, title, type, gameNumber } = this.props
    
    let user = list.map((index, keys) => {
      return(
        <li key={keys}>{index.username} <span className='points'>{index.points}</span></li>
      )
    })

    return(
      <div className={`board ${type}`}>
        <h2>{gameNumber ? (
            <span className='game-number'>
              Game <span>{gameNumber} </span> 
            </span>
          ):(
            ''
          )}
          <span>{title}</span>
        </h2>
        <ul>
          {user}
        </ul>
      </div>
    )
  }
}

export default LeaderList