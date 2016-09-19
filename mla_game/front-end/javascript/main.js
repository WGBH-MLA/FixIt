// imports
import React from 'react'
import ReactDOM from 'react-dom';
window.React = React
window.ReactDOM = ReactDOM

var appTarget = document.getElementById('app');
// component names should always begin with an uppercase letter
// state = owned by current component
// props = handed down from parent component
/* use _ as a prefix for custom functions
   // custom function
   _clickHandler: function(){} 
   // native to react    
   getInitialState: function(){}
*/

// test component
var ComponentTest = React.createClass({
  getInitialState: function(){
    return {
      key: 'value',
      count:0,
    };
  },

  _clickHandler: function(){
    this.setState({
      count:this.state.count + 1,
    })
  },

  render: function(){
    return (
      <div>
        <h2>Simple React {this.props.name}</h2>
        <button className="app-counter" onClick={this._clickHandler}>Change Count</button>
        <h1>{this.state.count}</h1>
        <h2>State Object Debugger</h2>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    )
  }
})

// render the app
ReactDOM.render(
  <ComponentTest name='Loaded Using NPM' />, 
appTarget);



// get random transcript. to be moved to it's own container
var getRandom = function(){
  $.ajax({
    url: '/api/transcript/random/',
  })
  .done(function(data) {
    console.log(data);
  });
};
getRandom();





// function reqListener () {
//     console.log(this.responseText);
// }

// var swapClass;

// document.getElementById("submit").onclick = nextPhraseButtons;

// function swapClassEvent (event) {
//     console.log('doing swap class');
//     if (event.srcElement.classList.contains('list-group-item-success')) {
//         event.srcElement.classList.remove('list-group-item-success');
//         event.srcElement.classList.add('list-group-item-danger');
//     }
//     else if (event.srcElement.classList.contains('list-group-item-danger')) {
//         event.srcElement.classList.remove('list-group-item-danger');
//         event.srcElement.classList.add('list-group-item-success');
//     }
// }

// var phraseAnchors = document.getElementsByClassName('list-group-item');

// var i;
// for (i = 0; i < phraseAnchors.length; i++) {
//     phraseAnchors[i].onclick = swapClassEvent;
// }

// function mediaURL (transcript_id) {
//     var mediaRequest = new XMLHttpRequest();
//     var mediaData;
//     mediaRequest.open('GET', '/api/media/' + transcript_id + '/');
//     mediaRequest.send();
//     mediaRequest.onreadystatechange = function () {
//         var player = document.getElementById('player');
//         var playersrc = document.getElementById('mp3src');
//         if (mediaRequest.readyState == 4 && (mediaRequest.status == 200)) {
//             mediaData = JSON.parse(mediaRequest.responseText);
//             console.log(mediaData.media);
//             playersrc.src = mediaData.media;
//             player.load();
//         }
//     };
// }

// var transcriptRequest = new XMLHttpRequest();
// var transcriptData;
// transcriptRequest.open('GET', '/api/transcript/random/');
// transcriptRequest.send();
// transcriptRequest.onreadystatechange = function () {
//     if (transcriptRequest.readyState == 4 && (transcriptRequest.status == 200)) {
//         transcriptData = JSON.parse(transcriptRequest.responseText);
//         mediaURL (transcriptData.transcript);
//         nextPhraseButtons (transcriptData.phrases);
//         document.getElementById('title').textContent = 'Title: ' + transcriptData.series;
//         document.getElementById('station').textContent = 'Station: ' + transcriptData.station;
//     }
// };

// function nextPhraseButtons (transcriptPhrases) {
//     var target;
//     for (var x=0; x < 3; x++) {
//         if (x === 0) {
//             target = document.getElementById('phrase1');
//             console.log(target);
//         }
//         else if (x === 1) {
//             target = document.getElementById('phrase2');
//             console.log(target);
//         }
//         else if (x === 2) {
//             target = document.getElementById('phrase3');
//             console.log(target);
//         }
//         target.textContent = transcriptData.phrases.shift().text;
//         if (target.classList.contains('list-group-item-danger')) {
//             target.classList.remove('list-group-item-danger');
//             target.classList.add('list-group-item-success');
//         }
//     }
// }
