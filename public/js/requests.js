function xhr(url, method="GET", data="", action=function(req) {window.location.replace(req.currentTarget.responseURL)}) {
  const req = new XMLHttpRequest();
  req.onload = action;
  req.open(method, url);
  req.send(data);
}

function putFromForm(formid) {
  const formdata = new FormData(document.getElementById(formid));
  xhr(window.location.href.replace("edit","articles"), "PUT", formdata);
}
