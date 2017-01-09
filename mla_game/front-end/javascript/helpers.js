export function getCookie(name) {
let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          let cookie = jQuery.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

// get user
export function getUserEndpoint() {
  return(
    $.ajax({
      url:'/api/profile/'
    })
  )
}

// post data
export function postData(endpoint, data) {
  return(
    $.ajax({
      url: endpoint,
      type: 'POST',
      data: data,
      headers: {
        // csrftoken token?
        "X-CSRFToken": getCookie('csrftoken')
      }
    })
  )
}