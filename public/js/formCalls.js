

/* watches the given input and changes the given form's action
*  SPECIFIC TO THE ADMIN FORM SITE. NOT REALLY REAUSEABLE.
*/
function watchInput(form_id, input_id) {
  const form_elem = document.getElementById(form_id);
  const input_elem = document.getElementById(input_id);
  const initial_form_action = form_elem.action;

  input_elem.oninput = (e) => {
    form_elem.action = initial_form_action + input_elem.value;
  }
}

/* Sends DELETE request to current url
*  TODO: Sends multiple requests? Why? Stop?
*/
function DELETE() {
  const req = new XMLHttpRequest();
  req.onload = () => {
    window.location.replace(req.response);
  };
  req.open("DELETE", window.location.href);
  req.send();
}


/* Simple, non-secure hashing function. Will prevent user passwords from being really easily read on transmition
*  Notice, passwords are rehashed with more secure function (and with better salt) before storage
*/
String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function hashInput(elemId, saltId) {
  const elemMain = document.getElementById(elemId);
  const elemSalt = document.getElementById(saltId);
  elemMain.value = String(elemMain.value + "" + elemSalt.value).hashCode();
}
