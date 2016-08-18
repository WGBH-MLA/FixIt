console.log('test');

function reqListener () {
    console.log(this.responseText);
}

var transcriptRequest = new XMLHttpRequest();
var transcriptData;
transcriptRequest.open('GET', '/api/transcript/random/');
transcriptRequest.send();
transcriptRequest.onreadystatechange = function () {
    if (transcriptRequest.readyState == 4 && (transcriptRequest.status == 200)) {
        transcriptData = JSON.parse(transcriptRequest.responseText);
        mediaURL (transcriptData.transcript);
    }
};

function mediaURL (transcript_id) {
    var mediaRequest = new XMLHttpRequest();
    var mediaData;
    mediaRequest.open('GET', '/api/media/' + transcript_id + '/');
    mediaRequest.send();
    mediaRequest.onreadystatechange = function () {
        var player = document.getElementById('player');
        var playersrc = document.getElementById('mp3src');
        if (mediaRequest.readyState == 4 && (mediaRequest.status == 200)) {
            mediaData = JSON.parse(mediaRequest.responseText);
            console.log(mediaData.media);
            playersrc.src = mediaData.media;
            player.load();
        }
    };
}
