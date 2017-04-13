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
export function patchData(endpoint, data) {
  return(
    axios({
      method: 'PATCH',
      url: endpoint,
      data: data,
      headers: {
        // csrftoken token?
        "X-CSRFToken": getCookie('csrftoken')
      }
    })
  )
}

// create multidimensional array based on number
export function partition(items, size) {
  var p = [];
  for (var i=Math.floor(items.length/size); i-->0; ) {
    p[i]=items.slice(i*size, (i+1)*size);
  }
  return p;
}

// pop up social sharing
export function PopupCenter(url, title, w, h) {
  var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left,
      dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top, 
      width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
      height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
      left = ((width / 2) - (w / 2)) + dualScreenLeft,
      top = ((height / 2) - (h / 2)) + dualScreenTop,
      newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)
  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}
