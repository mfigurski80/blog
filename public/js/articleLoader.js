// const masonry_elem = document.getElementsByClassName("masonry")[0];

// masonry_elem.innerHTML = "";

var countAskedForArticles = 0;

var articleLoader = setInterval(function() {
  if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 500) {
    var new_elems = [];
    const req = new XMLHttpRequest();

    req.onload = (err, res)=>{ // when request loads...
      var res = JSON.parse(req.responseText);
      if (res.length > 0) { // if more than 0 articles are returned
        res.forEach(item => {
          var elem = document.createElement("article");
          switch (item.type) {
            case null:
              elem = makeTextCard(elem, item);
              break;
            case "text":
              elem = makeTextCard(elem, item);
              break;
            case "contact":
              break;
            case "media":
              break;
            case "profile":
              break;
          }
          masonry_elem.appendChild(elem); //add tile to masonry
          new_elems.push(elem);
        });

        msnry.appended(new_elems);

      }
      if (res.length < 9) { // if less than full (9) amount of articles returned
        clearInterval(articleLoader); // stop looking
      }
    }

    countAskedForArticles++;
    req.open("GET", window.location.href + "articleData/" + countAskedForArticles);
    console.log(window.location.href + "articleData/" + countAskedForArticles)
    req.send();
  }
}, 2000);





function makeContactCard(elem, item) {
  elem.classList.add("masonry-item");

  return elem;
}

function makeMediaCard(elem, item) {
  elem.classList.add("masonry-item","masonry-item-");

  return elem;
}

function makeProfileCard(elem, item) {
  elem.classList.add("masonry-item","masonry-item-");

  return elem;
}

function makeTextCard(elem, item) {

  elem.classList.add("masonry-item","masonry-item-text");

  let card = document.createElement("div")
  card.classList.add("card");
  elem.appendChild(card);

  let wrapper_pad = document.createElement("div")
  wrapper_pad.classList.add("wrapper-pad");
  card.appendChild(wrapper_pad);

  let textbox = document.createElement("div")
  textbox.classList.add("textbox");
  wrapper_pad.appendChild(textbox);

  let a1 = document.createElement("a");
  a1.setAttribute("href", "articles/" + item.title);
  textbox.appendChild(a1);

  let h4 = document.createElement("h4");
  a1.appendChild(h4);

  let title = document.createTextNode(item.title);
  h4.appendChild(title);


  let p1 = document.createElement("p");
  textbox.appendChild(p1);

  let date = document.createTextNode(item.day + " " + item.month + " " + item.year);
  p1.appendChild(date);

  let p2 = document.createElement("p");
  textbox.appendChild(p2);

  let content = document.createTextNode(item.content);
  p2.appendChild(content);

  let a2 = document.createElement("a");
  a2.setAttribute("href","articles/" + item.title);
  textbox.appendChild(a2);

  let readMore = document.createTextNode("Read More");
  a2.appendChild(readMore);

  return elem;
}
