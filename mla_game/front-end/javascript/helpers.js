import axios from 'axios'

export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          let cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

// post data. helper was created because CSRFToken needs to be set
export function postData(endpoint, data) {
  return(
    axios({
      method: 'post',
      url: endpoint,
      data: data,
      headers: {
        // csrftoken token?
        "X-CSRFToken": getCookie('csrftoken')
      }
    })
  )
}

// let total = [];
// for (var i = 0; i < data.results.length; i++) {
//   total.push(data.results[i].score);
// }
// var totalScore = total.reduce((a, b) => a + b, 0);


