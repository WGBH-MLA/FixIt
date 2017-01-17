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
      method: 'POST',
      url: endpoint,
      data: data,
      headers: {
        // csrftoken token?
        "X-CSRFToken": getCookie('csrftoken')
      }
    })
  )
}

// post data. helper was created because CSRFToken needs to be set
export function postSData(endpoint, data) {
  return(
    axios({
      method: 'POST',
      url: endpoint,
      data: data,
      paramsSerializer: function(params) {
        return Qs.stringify(params, {arrayFormat: 'brackets'})
      },
      headers: {
        // csrftoken token?
        "X-CSRFToken": getCookie('csrftoken')
      }
    })
  )
}