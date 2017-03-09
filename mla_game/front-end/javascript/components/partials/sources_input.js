import React from 'react'

class SourcesInput extends React.Component {

  constructor(){
    super()
    this.checkSources =this.checkSources.bind(this)
    this.toggleSource =this.toggleSource.bind(this)

    this.state = {
      checked:false
    }

  }

  toggleSource(){
    const {pk, sources, source, stateSources} = this.props
    let sourceIsSet = stateSources.includes(pk)
    this.props.selectSource(pk)  

    if(sourceIsSet) {
      this.setState({checked:false})
    } else {
      this.setState({checked:true})
    }
    console.log(this)
  }

  checkSources(){
    this.props.sources.map((index, elem) => {
      console.log(index, elem)
      if(index === this.props.pk) {
        this.setState({
          checked:true
        })
      }
    })
  }
  
  componentDidMount(){
    this.checkSources()
  }

  render(){
    const {pk, source, state} = this.props
    return(
        <span className='source'>
          <label>
            <input className="checkbox" id={pk} type="checkbox"/>
            <span className="state">{state}</span>
            <span className="name">{source}</span>
          </label>
        </span>
    )
  }
}

SourcesInput.proptypes = {
  source:React.PropTypes.string.isRequired,
  pk:React.PropTypes.string.isRequired,
  state:React.PropTypes.string.isRequired,
}

export default SourcesInput;