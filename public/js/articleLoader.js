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
              elem = makeContactCard(item);
              break;
            case "media":
              elem = makeMediaCard(item)
              break;
            case "profile":
              break;
            case "post":
              elem = makePostCard(item);
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





function makeContactCard(item) {
  let elem = makeElem({type:"article", classList:["masonry-item","masonry-item-contact"]});
  let card = makeElem({classList:["card", "pop"], childOf:elem});

  let wrapper_pad1 = makeElem({classList:["wrapper-pad"], childOf:card});
  let h4 = makeElem({type: "h4", text:"Like what you see? Send me a ", childOf:wrapper_pad1});
  let primary1 = makeElem({type:"span", classList:["primary"], text:"message", childOf:h4});
  let exclamation = document.createTextNode("!!");
  h4.appendChild(exclamation);

  let wrapper_pad2 = makeElem({classList:["wrapper-pad"], childOf:card});
  let form = makeElem({type:"form", attributes:{"method":"post","action":"messages"}, childOf:wrapper_pad2});
  let input_name = makeElem({type: "input", attributes:{"type":"text","placeholder":"Preferred Name","name":"name"}, childOf:form});
  let input_email = makeElem({type:"input", attributes:{"type":"text","placeholder":"Email","name":"email"}, childOf:form});
  let textarea = makeElem({type:"textarea", attributes:{"placeholder":"Message!","name":"message"}, childOf:form});
  let button = makeElem({type:"button", classList:["button"], text:"Submit", childOf:form});

  let wrapper_pad3 = makeElem({classList:["wrapper-pad"], childOf:card});
  let h5 = makeElem({type:"h5", text: "Or, ", childOf:wrapper_pad3});
  let primary2 = makeElem({type:"span",classList:["primary"], text:"email ", childOf:h5});
  let meAt = document.createTextNode("me at ");
  h5.appendChild(meAt);
  let a = makeElem({type:"a", attributes:{"href":"mailto:meek.f80@gmail.com"}, text:"meek.f80@gmail.com", childOf:h5});

  return elem;
}

function makeMediaCard(item) {
  let elem = makeElem({type:"article", classList:["masonry-item","masonry-item-media"]});

  let card = createElem({classList:["card"], childOf:elem});

  let a = createElem({type:"a", attributes:{"href":"articles/" + item.title}, childOf:card});

  let img = createElem({type:"img", attributes:{"src": "images/" + item.image, "alt":item.title, childOf:a}});

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

function makePostCard(item) {
  let article = makeElem({type:"article", classList:["masonry-item","masonry-item-post"]});
  let card = makeElem({classList:["card"], childOf:article});

  let card_bg = makeElem({classList:["card-bg"], attributes:{"style":"background-image: url('./images/" + item.image + "')"}, childOf:card});
  let wrapper_pad1 = makeElem({classList:["wrapper-pad","flex-center"], childOf:card_bg});
  let wrapper1 = makeElem({classList:["wrapper"], childOf:wrapper_pad1});
  let h2 = makeElem({type:"h2", text:item.day, childOf:wrapper1});
  let h3 = makeElem({type:"h3", text:item.month, childOf:wrapper1});
  let h4 = makeElem({type:"h6", text:item.year, childOf:wrapper1});

  let card_post = makeElem({classList:["card-post"], childOf:card});
  let wrapper_pad2 = makeElem({classLIst:["wrapper-pad"], childOf:card_post});
  let textbox = makeElem({classList:["textbox"], childOf:wrapper_pad2});
  let h4 = makeElem({type:"h4", childOf:textbox});
  let a = makeElem({type:"a", attributes:{"href":"articles/" + item.title}, text:art.title, childOf:h4});
  let p = makeElem({type:"p", text:item.content, childOf:textbox});


  return article;
}

// {type:"div", classList:[], attributes:{}, text:"", childOf:undefine}
function makeElem(args = {}) {
  //create defaults for args
  if (!args.type) {
    args.type = "div";
  }
  if (!args.classList) {
    args.classList = [];
  }
  if (!args.attributes) {
    args.attributes = {};
  }


  const elem = document.createElement(args.type); // create the elem

  args.classList.forEach(clss => { // add all classes
    elem.classList.add(clss);
  });
  for (let key in args.attributes) { // add all attributes
    elem.setAttribute(key, args.attributes[key]);
  }
  if (args.text) { // add text nodes
    let text_elem = document.createTextNode(args.text);
    elem.appendChild(text_elem);
  }
  if (args.childOf) { // add parent
    args.childOf.appendChild(elem);
  }

  return elem; // return!
}
