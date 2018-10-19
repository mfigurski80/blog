// const masonry_elem = document.getElementsByClassName("masonry")[0];

// masonry_elem.innerHTML = "";

var countAskedForArticles = 0;

var articleLoader = setInterval(function() {
  if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 500) {
    var new_elems = [];
    const req = new XMLHttpRequest();

    req.onload = (err, res)=>{ // when request loads...
      if (req.responseText.length > 3) { // if articles are returned
        const res = JSON.parse(req.responseText);

        res.forEach(item => {
          let elem = document.createElement("article");
          elem.classList.add("masonry-item");
          switch (item.type) {
            case "text":
              elem.classList.add("masonry-item-text")
              break;
          }

          new_elems.push(elem);
        });

      } else { // if no articles returned...
        clearInterval(articleLoader); // stop looking
      }
    }

    countAskedForArticles++;
    req.open("GET", window.location.href + "articleData/" + countAskedForArticles);
    console.log(window.location.href + "articleData/" + countAskedForArticles)
    req.send();
  }
}, 1000);
