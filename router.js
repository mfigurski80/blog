const express = require("Express");
const router = express.Router();
const Database = require("./Database.js");
const Session = require("./Session.js");

const db = new Database('./db/main.db');
var curSessions = {};
// const upload = multer({ dest: 'public/images' })



/* ******
* Helper functions
****** */
// checks authorization
function isReqAuthorized(req) {
  if (curSessions[req.cookies.SessionID] && curSessions[req.cookies.SessionID].user.isLoggedIn) {
    return true;
  }
  return false;
}
// Secure Hashing Function (SHA256)
function SHA256(r){function k(r,n){var t=(65535&r)+(65535&n);return(r>>16)+(n>>16)+(t>>16)<<16|65535&t}function q(r,n){return r>>>n|r<<32-n}function s(r,n){return r>>>n}return function(r){for(var n="0123456789abcdef",t="",e=0;e<4*r.length;e++)t+=n.charAt(r[e>>2]>>8*(3-e%4)+4&15)+n.charAt(r[e>>2]>>8*(3-e%4)&15);return t}(function(r,n){var t,e,o,a,f,u,c,h,i,C,g,A,d,v,l,S,m,y,w=new Array(1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298),b=new Array(1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225),p=new Array(64);r[n>>5]|=128<<24-n%32,r[15+(n+64>>9<<4)]=n;for(var H=0;H<r.length;H+=16){t=b[0],e=b[1],o=b[2],a=b[3],f=b[4],u=b[5],c=b[6],h=b[7];for(var j=0;j<64;j++)p[j]=j<16?r[j+H]:k(k(k(q(y=p[j-2],17)^q(y,19)^s(y,10),p[j-7]),q(m=p[j-15],7)^q(m,18)^s(m,3)),p[j-16]),i=k(k(k(k(h,q(S=f,6)^q(S,11)^q(S,25)),(l=f)&u^~l&c),w[j]),p[j]),C=k(q(v=t,2)^q(v,13)^q(v,22),(g=t)&(A=e)^g&(d=o)^A&d),h=c,c=u,u=f,f=k(a,i),a=o,o=e,e=t,t=k(i,C);b[0]=k(t,b[0]),b[1]=k(e,b[1]),b[2]=k(o,b[2]),b[3]=k(a,b[3]),b[4]=k(f,b[4]),b[5]=k(u,b[5]),b[6]=k(c,b[6]),b[7]=k(h,b[7])}return b}(function(r){for(var n=Array(),t=0;t<8*r.length;t+=8)n[t>>5]|=(255&r.charCodeAt(t/8))<<24-t%32;return n}(r=function(r){r=r.replace(/\r\n/g,"\n");for(var n="",t=0;t<r.length;t++){var e=r.charCodeAt(t);e<128?n+=String.fromCharCode(e):(127<e&&e<2048?n+=String.fromCharCode(e>>6|192):(n+=String.fromCharCode(e>>12|224),n+=String.fromCharCode(e>>6&63|128)),n+=String.fromCharCode(63&e|128))}return n}(r)),8*r.length))}
// Cleans text of malicious content
String.prototype.cleanText = function() {
  return this.replace(new RegExp("'",'g'), "&#39;");
}
String.prototype.uncleanText = function() {
  return this.replace(new RegExp("&#39;",'g'), "'");
}


/* INITIAL CLEANER FUNCTION
*  Handles sessions and such
*/
router.use("*", function(req, res, next) {
  /* private recursive function for timing out session objects
  */
  function timeoutSession(ses, timeout = 1000*60*5) {
    setTimeout(() => {
      console.log("\t\t" + ses.user.name + " timeout?", Date.now() >= ses.last_request + timeout);
      if (Date.now() >= ses.last_request + timeout) {
        console.log("\tRemoving: " + ses.user.name);
        // db.addSessionData(ses.id, ses.requestCount, ses.requestsHist, ses.requestsTimestamp); // save session data
        delete curSessions[ses.id];
      } else {
        timeoutSession(ses, timeout - (Date.now() - ses.last_request) + 1000);
      }
    }, timeout);
  }
  // Main Cookie Checker
  if (req.cookies.SessionID == undefined || curSessions[req.cookies.SessionID] == undefined) {// if user does not have a session...
    const ses = new Session(req);                          // create session for user
    res.cookie('SessionID', ses.id, {maxAge: ses.timeout}); // give user id from session
    curSessions[ses.id] = ses;                           // save it into curSessions
    console.log("\tNew session: " + ses.id + " requesting: " + req.headers.host + req.baseUrl);
    timeoutSession(ses, ses.timeout + 1000);            //set timeout for session
  } else {                                    // user already has session...
    const ses = curSessions[req.cookies.SessionID] //grab the right Session
    ses.logRequest(req);                          // log the new request
    res.cookie('SessionID', ses.id, {maxAge: ses.timeout}); // update the cookie timeout
    console.log("\tSession: " + ses.user.name + " requesting: " + req.headers.host + req.baseUrl);
  }
  next();
});








/* *****
* PAGES
***** */
// HOME
router.get("/", function(req, res) {
  db.getAllArticles(action = (err, rows) => { //get articles... when gotten...
    var articles_list = [];

    // get the all the initial articles
    rows.forEach(row => { //divide rows into a list of articles
      // row has: title, content, day, month, year, type
      row.title = row.title.uncleanText();
      row.content = row.content.uncleanText().substring(0,700);
      articles_list.push(row);
    });


    //reverse the articles!! Give only 10!!
    articles_list = articles_list.reverse().slice(0,9);

    // add a profile article as the second/third article
    const profile = {
      title: "Mikolaj Figurski",
      content: "Short demo bio Hey",
      type: "profile",
      image: "images/profile-large.jpg"
    }
    articles_list.splice(Math.floor(Math.random()*2)+1,0,profile);

    // add a contact article as last article
    articles_list.push({title: "Contact", type: "contact"})

    res.render('home', { //render the home page
      articles: articles_list
    });
  });
});

// ARTICLES
router.get("/articles/:article", function(req, res, next) {
  db.getArticle(title = req.params.article.cleanText() ,action = (err, rows) => {
    if (rows.length != 0) { // if article exists
      rows[0].title = rows[0].title.uncleanText();
      rows[0].content = rows[0].content.uncleanText();
      res.render('article', {
        article: rows[0]
      });
    } else {
      next(); //else, continue (to 404)
    }
  });
});
router.post("/articles/:article", function(req, res) {
  if (isReqAuthorized(req)) {
    req.body.title = req.body.title.replace(new RegExp("\\?", "g"),"");
    if (req.files && req.files.imageFile) { // if there's an image sent (YAY!!)
      req.files.imageFile.mv("public/images/" + req.files.imageFile.name, function(err) {});
      req.body.imageFile = req.files.imageFile.name;
    }
    db.addArticle(req.body.title.cleanText(), req.body.content.cleanText(), req.body.type.cleanText(), req.body.imageFile);
    console.log("Posted: " + req.body.title);
    res.redirect('/articles/' + req.body.title);
  } else {
    res.redirect('back');
  }
});
router.delete("/articles/:article", function(req, res) {
  res.send('/'); // notice, AJAX should catch and redirect to this string
  if (isReqAuthorized(req)) {
    db.deleteArticle(req.params.article);
    console.log("Deleted: " + req.params.article);
  }
});

// LOGIN
router.get("/login", function(req, res) {
  res.render('login');
});
router.post("/login", function(req, res) {
  const id = req.cookies.SessionID;
  // req.cookies.SessionID
  // req.body.username, password (shorthashed)
  // rows[0].username, password, name, salt
  db.getUser(req.body.username, action = (err, rows) => {
    if (rows.length != 0 && SHA256(req.body.password + rows[0].salt) == rows[0].password) {
      curSessions[id].user.isLoggedIn = true;
      curSessions[id].user.username = req.body.username;
      curSessions[id].user.name = rows[0].name;
      console.log(curSessions[id].user.name + " has logged in");
      res.redirect("/admin");
    } else {
      res.redirect("/login")
    }
  });
})

// ADMIN
router.get("/admin", function(req, res) {
  if (isReqAuthorized(req)) {
    res.render('admin');
  } else {
    res.redirect("/login");
  }
});
router.post("/admin", function(req, res) {
  req.redirect("back");
  db.addMessage(req.body.name.cleanText(), req.body.email.cleanText(), req.body.message.cleanText());
});

// SIGNUP
router.get("/signup", function(req, res) {
  res.render("signUp.pug")
});
router.post("/signup", function(req, res) {
  if (isReqAuthorized(req)) { //NOTE: only authorized users can make new users
    const salt = curSessions[req.cookies.SessionID].makeRandString(20);
    db.addUser(req.body.username, SHA256(String(req.body.password + salt)), req.body.name, salt, req.body.name + " has not written anything here yet!");
    res.redirect("/admin");
  } else {
    res.send("You must be signed in to create new users");
  }
});

// AJAX ARTICLE DATA
router.get("/articledata/:countAlreadyAsked", function(req, res) {
  db.getAllArticles((err, rows) => {
    var articles_list = [];
    rows.forEach(row => { //divide rows into a list of articles
      // row has: title, content, day, month, year, type
      row.title = row.title.uncleanText();
      row.content = row.content.uncleanText().substring(0,700);
      articles_list.push(row);
    });
    const pos = parseInt(req.params.countAlreadyAsked) * 10;
    rows = rows.reverse().slice(pos, pos+10);
    res.json(rows)
  });
});

// MESSAGES
router.post("/messages", function(req, res) {
  res.send("Thanks for your message!!");
  db.addMessage(req.body.name, req.body.email, req.body.message);
})

// Catch all remaining requests (with 404)
router.get("*", function(req, res) {
  res.status("404");
  res.send("404");
});

module.exports = router;
