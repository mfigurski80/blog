// const masonry_elem = document.getElementsByClassName("masonry")[0];

// masonry_elem.innerHTML = "";

var countAskedForArticles = 0;

var articleLoader = setInterval(function() {
  if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 1000) {
    var new_elems = [];
    countAskedForArticles++;

    const req = new XMLHttpRequest();
    req.onload = () => { // when request loads...
      var res = req.responseText;

      if (res.length == 0) { // if no articles returned
        clearInterval(articleLoader); // stop looking
      } else {
        const interim = document.createElement("div");
        interim.innerHTML = res;
        var articles = interim.childNodes;
        while (articles[0]) { //for each article, add class
          articles[0].classList.add("new-item");
          masonry_elem.appendChild(articles[0]);
        }

        var new_items = document.getElementsByClassName("new-item");
        msnry.appended(new_items); //do masonry
        while (new_items[0]) { //for each article, remove class
          new_items[0].classList.remove("new-item");
        }
      }
    }

    req.open("GET", window.location.href + "articleData/" + countAskedForArticles);
    console.log(window.location.href + "articleData/" + countAskedForArticles)
    req.send();
  }
}, 2000);
