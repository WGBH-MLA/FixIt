import React from 'react'
import UserForm from '../partials/user_form'
import PreferencesForm from '../partials/preferences_form'

class Preferences extends React.Component{

  componentWillUnmount(){
    this.props.fetchData()
  }
  
  render(){
    return (
      <div className="preferences">
        <div className="user-form">
          <div className="grid">
            <span className="user">{this.props.initialData.username}</span>
            <UserForm 
              data={this.props.initialData}
              setUsername={this.props.setUsername}
            />
          </div>
        </div>
        <PreferencesForm 
          user={this.props.initialData.user[0].pk}
          topics={this.props.preferencesOptions.topics}
          source={this.props.preferencesOptions.source}
          preferred_topics={this.props.initialData.user[0].preferred_topics}
          preferred_stations={this.props.initialData.user[0].preferred_stations}
        />
      </div>
    )
  }

};
export default Preferences;