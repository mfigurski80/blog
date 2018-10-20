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
              elem = makeContactCard(elem, item);
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
  elem.classList.add("masonry-item","masonry-item-contact");

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

function makeMediaCard(elem, item) {
  elem.classList.add("masonry-item","masonry-item-media","masonry-item-large");

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
