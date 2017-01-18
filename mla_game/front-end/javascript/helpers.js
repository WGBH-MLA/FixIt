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

// styling object for modal window
const customStyles = {
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(0, 0, 0, 0.75)',
    zIndex:5, 
  },
  
  content : {
    top           : '50%',
    left          : '50%',
    right         : 'auto',
    bottom        : 'auto',
    marginRight   : '-50%',
    transform     : 'translate(-50%, -50%)',
    background    : '#221e1f',
    maxWidth      : '42.5em',
    maxHeight     : '100vh',
  }
}
export default customStyles;

