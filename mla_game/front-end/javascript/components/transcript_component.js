import React from 'react'
import Audio from '../components/audio_component'
import GameMeta from '../components/game_meta'
import Submit from '../components/submitPhrase_component'
import Phrase from '../components/phrase_list'
import Paging from '../components/paginator'

class TranscriptUI extends React.Component{

  constructor(){
    super();
    this._syncAudio = this._syncAudio.bind(this); 
    this._playPhrase = this._playPhrase.bind(this);
    this._delayRender = this._delayRender.bind(this);
    this._renderGame = this._renderGame.bind(this);
    this._paginate = this._paginate.bind(this);
    this._selectPage = this._selectPage.bind(this);
    
    this.state = {
      currentTime:0,
      isPlaying:false,
      loaded:false,
      pagination:{
        page:1,
        perPage:8
      }
    }
  }
  
  _syncAudio(time, paused) {
    this.setState({
      currentTime:time,
      isPlaying:paused
    })
  }

  _playPhrase(callback){
    var media = document.querySelector('.audio-player');
    media.currentTime = callback;
    media.play();
  }

  _delayRender() {
    this.setState({
      loaded:true
    })
  }

  _selectPage(page) {
    const state = this.state;
    const pagination =  state.pagination || {};
    const pages = Math.ceil(this.props.phrases.length / pagination.perPage);

    pagination.page = Math.min(Math.max(page, 1), pages);

    this.setState({
      pagination: pagination
    });
  }

  _paginate(data, o) {
    data = data || [];

    let page = o.page - 1 || 0;
    let perPage = o.perPage;

    let amountOfPages = Math.ceil(data.length / perPage);
    let startPage = page < amountOfPages ? page: 0;

    return {
      amount: amountOfPages,
      data: data.slice(startPage * perPage, startPage * perPage + perPage),
      page: startPage + 1
    };
  }

  _renderGame(){
    if(this.state.loaded) {
      let data = this.props.phrases;
      let pagination = this.state.pagination;
      let paginated = this._paginate(data, pagination);
      let pages = Math.ceil(data.length / Math.max(
        isNaN(pagination.perPage) ? 1 : pagination.perPage, 1)
      );
      return(
        <div>
          <div className="app-content">
            <h3>State as Object</h3>
            <pre>{JSON.stringify(this.state, null, 2)}</pre>
            
            <div className='game-meta'>
              <Audio src={this.props.media_url} _syncAudio={this._syncAudio}  isPlaying={this.state.isPlaying} />
              <GameMeta meta={this.props.meta} aapb_link={this.props.aapb_link} />
            </div>
            <ul className="game-phrase-list">
              {paginated.data.map((phrase, index) =>
                <Phrase key={index} 
                _playPhrase={this._playPhrase} 
                _selectPhrase={this._selectPhrase} 
                 time={this.state.currentTime} 
                 index={index} 
                 details={phrase} />
              )}
            </ul>
          </div>  
          <div className="game-footer">
            <div className="grid">
              <h2 className='title delta'><span>1</span> Identify Errors</h2>
              <div className="controls">
                <Paging
                  pagination={pagination} 
                  pages={pages} 
                  onSelect={this._selectPage} />
                
                <progress max={pages} value={this.state.pagination.page}></progress>
              </div>
              <button className="help">
                <title>Help</title>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                  <path d="M100 200C44.9 200 0 155.1 0 100S44.9 0 100 0s100 44.9 100 100-44.9 100-100 100zm0-180.4c-44.3 0-80.4 36.1-80.4 80.4 0 44.3 36.1 80.4 80.4 80.4s80.4-36.1 80.4-80.4c0-44.3-36.1-80.4-80.4-80.4z"/>
                  <path d="M90.2 120.6c-.4-4.6-.2-8.6.7-11.8.9-3.2 2.1-6 3.7-8.4 1.6-2.4 3.3-4.4 5.3-6.1 2-1.7 3.9-3.4 5.6-5 1.7-1.6 3.2-3.3 4.3-5 1.2-1.7 1.7-3.8 1.7-6.2 0-3.1-.9-5.6-2.6-7.5-1.7-1.9-4.8-2.8-9.3-2.8-1.4 0-2.9.2-4.5.5s-3.2.8-4.8 1.3c-1.6.6-3.1 1.2-4.6 2-1.5.8-2.8 1.5-3.9 2.3l-6.7-12.8c3.4-2.3 7.3-4.2 11.7-5.7 4.4-1.5 9.7-2.3 15.9-2.3 8.4 0 14.9 2 19.6 6.1 4.7 4 7.1 9.5 7.1 16.3 0 4.5-.6 8.3-1.8 11.3-1.2 3-2.7 5.5-4.5 7.6-1.8 2.1-3.7 3.9-5.9 5.5-2.1 1.6-4.1 3.3-5.9 5.1-1.8 1.8-3.3 3.9-4.5 6.3-1.2 2.4-1.9 5.5-1.9 9.2H90.2zm-2.7 19c0-3.1 1-5.6 2.9-7.4 2-1.8 4.5-2.7 7.7-2.7 3.4 0 6 .9 8 2.7 2 1.8 2.9 4.3 2.9 7.4 0 3.1-1 5.6-2.9 7.5-2 1.9-4.6 2.8-8 2.8-3.2 0-5.8-.9-7.7-2.8s-2.9-4.4-2.9-7.5z"/>
                </svg>
              </button>              
            </div>
          </div>    
        </div>
      )

    } else {
      return(
        <div className="app-content loading-screen">
          <svg className='loading-animation' viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <rect x="0" y="0" width="100" height="100" fill="none"></rect>
            <defs>
              <filter id="uil-ring-shadow" x="-100%" y="-100%" width="300%" height="300%">
                <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0"></feOffset>
                <feGaussianBlur result="blurOut" in="offOut" stdDeviation="0"></feGaussianBlur>
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>
              </filter>
            </defs>
              <path d="M10,50c0,0,0,0.5,0.1,1.4c0,0.5,0.1,1,0.2,1.7c0,0.3,0.1,0.7,0.1,1.1c0.1,0.4,0.1,0.8,0.2,1.2c0.2,0.8,0.3,1.8,0.5,2.8 c0.3,1,0.6,2.1,0.9,3.2c0.3,1.1,0.9,2.3,1.4,3.5c0.5,1.2,1.2,2.4,1.8,3.7c0.3,0.6,0.8,1.2,1.2,1.9c0.4,0.6,0.8,1.3,1.3,1.9 c1,1.2,1.9,2.6,3.1,3.7c2.2,2.5,5,4.7,7.9,6.7c3,2,6.5,3.4,10.1,4.6c3.6,1.1,7.5,1.5,11.2,1.6c4-0.1,7.7-0.6,11.3-1.6 c3.6-1.2,7-2.6,10-4.6c3-2,5.8-4.2,7.9-6.7c1.2-1.2,2.1-2.5,3.1-3.7c0.5-0.6,0.9-1.3,1.3-1.9c0.4-0.6,0.8-1.3,1.2-1.9 c0.6-1.3,1.3-2.5,1.8-3.7c0.5-1.2,1-2.4,1.4-3.5c0.3-1.1,0.6-2.2,0.9-3.2c0.2-1,0.4-1.9,0.5-2.8c0.1-0.4,0.1-0.8,0.2-1.2 c0-0.4,0.1-0.7,0.1-1.1c0.1-0.7,0.1-1.2,0.2-1.7C90,50.5,90,50,90,50s0,0.5,0,1.4c0,0.5,0,1,0,1.7c0,0.3,0,0.7,0,1.1 c0,0.4-0.1,0.8-0.1,1.2c-0.1,0.9-0.2,1.8-0.4,2.8c-0.2,1-0.5,2.1-0.7,3.3c-0.3,1.2-0.8,2.4-1.2,3.7c-0.2,0.7-0.5,1.3-0.8,1.9 c-0.3,0.7-0.6,1.3-0.9,2c-0.3,0.7-0.7,1.3-1.1,2c-0.4,0.7-0.7,1.4-1.2,2c-1,1.3-1.9,2.7-3.1,4c-2.2,2.7-5,5-8.1,7.1 c-0.8,0.5-1.6,1-2.4,1.5c-0.8,0.5-1.7,0.9-2.6,1.3L66,87.7l-1.4,0.5c-0.9,0.3-1.8,0.7-2.8,1c-3.8,1.1-7.9,1.7-11.8,1.8L47,90.8 c-1,0-2-0.2-3-0.3l-1.5-0.2l-0.7-0.1L41.1,90c-1-0.3-1.9-0.5-2.9-0.7c-0.9-0.3-1.9-0.7-2.8-1L34,87.7l-1.3-0.6 c-0.9-0.4-1.8-0.8-2.6-1.3c-0.8-0.5-1.6-1-2.4-1.5c-3.1-2.1-5.9-4.5-8.1-7.1c-1.2-1.2-2.1-2.7-3.1-4c-0.5-0.6-0.8-1.4-1.2-2 c-0.4-0.7-0.8-1.3-1.1-2c-0.3-0.7-0.6-1.3-0.9-2c-0.3-0.7-0.6-1.3-0.8-1.9c-0.4-1.3-0.9-2.5-1.2-3.7c-0.3-1.2-0.5-2.3-0.7-3.3 c-0.2-1-0.3-2-0.4-2.8c-0.1-0.4-0.1-0.8-0.1-1.2c0-0.4,0-0.7,0-1.1c0-0.7,0-1.2,0-1.7C10,50.5,10,50,10,50z" fill="#ffae18" filter="url(#uil-ring-shadow)">
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" repeatCount="indefinite" dur="1.5s"></animateTransform>
            </path>
          </svg>
        </div>
      )
    }
  }

  componentDidMount(){
    setTimeout(this._delayRender, 5000);
  }
    
  render(){
    return (
    <div>
      {this._renderGame()}
    </div>
    )
  }
}

export default TranscriptUI;