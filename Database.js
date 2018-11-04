const sqlite3 = require('sqlite3').verbose();

// Actual sqlite3 Database
// Export it as a module
module.exports = class Database {
  constructor(pathTo) {
    this.pathTo = pathTo;
    this.replaceCharacters = [["'"],["&#39;"]];
  }

  // Helps prevent sql injections, cleans and uncleans stuff
  clean(string) {
    this.replaceCharacters[0].forEach((char, pos) => {
      if (string && string.includes(char)) {
        string = string.replace(new RegExp(char,'g'), this.replaceCharacters[1][pos]);
      }
    });
    return string;
  }
  unclean(string) {
    this.replaceCharacters[1].forEach((chars, pos) => {
      if (string && string.includes(chars)) {
        string = string.replace(new RegExp(chars, 'g'), this.replaceCharacters[0][pos]);
      }
    });
    return string;
  }


  // Runs given SQL code, returns anything there is to return... used for everything but reading data
  run(runable) {
    const db = new sqlite3.Database(this.pathTo, (err) => {
      if (err) {throw(err.message);}
    });
    const returnable = db.run(runable);
    db.close();
    return returnable;
  }

  addArticle(title, content, type, imageFile) {
    const d = new Date();
    const day = d.getDate();
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
    const year = d.getFullYear();
    this.run("INSERT INTO articles (title, content, day, month, year, type, image) VALUES ('" + this.clean(title) + "', '" + this.clean(content) + "', " + day + ", '" + month + "', " + year + ", '" + this.clean(type) + "', '" + this.clean(imageFile) + "')");
  }
  deleteArticle(title) {
    this.run("DELETE FROM articles WHERE title = '" + this.clean(title) + "'");
  }
  updateArticle(title, newtitle, content) {
    this.run("UPDATE articles SET title = '" + this.clean(newtitle) + "', content = '" + this.clean(content) + "' WHERE title = '" + this.clean(title) + "'");
  }
  addUser(username, password, name, salt, bio="") {
    this.run("INSERT INTO users (username, password, name, salt, bio) VALUES ('" + this.clean(username) + "', '" + this.clean(password) + "', '" + this.clean(name) + "', '" + salt + "', '" + this.clean(bio) + "')");
  }
  updateUser(username, name, bio) {
    this.run("UPDATE users SET name='" + this.clean(name) + "', bio = '" + this.clean(bio) + "' WHERE username = '" + this.clean(username) + "'");
  }


  addMessage(name, email, message) {
    const d = new Date();
    const day = d.getDate();
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
    const year = d.getFullYear();
    this.run("INSERT INTO messages (name, email, message, day, month, year) VALUES ('" + this.clean(name) + "', '" + this.clean(email) + "', '" + this.clean(message) + "', " + day + ", '" + month + "', " + year + ")");
  }
  addSessionData(key, requestCount, requestsHist, requestsTimestamp) {
    this.run("INSERT INTO sessionData (key, requestCount, requestsHist, requestsTimestamp) VALUES ('" + key + "', " + requestCount + ", '" + requestsHist + "', '" + requestsTimestamp + "')");
  }


  // gets given item from given table, with callback function... used for reading data
  get(table, selection, condition, action) {
    const db = new sqlite3.Database(this.pathTo);
    db.all("SELECT " + selection + " FROM " + this.clean(table) + " WHERE " + condition, [], (err, rows) => {
      if (err) {
        console.log(err);
      } else if (rows.length > 0) {
        //unclean the information
        rows.forEach(row => { // for each sample returned
          Object.values(row).forEach(val => { // for all sample info
            if (typeof val === 'string') { // if its a string
              val = this.unclean(val); // unclean it
            }
          });
        });

        // and actually do the action with unclean rows
        action(rows);
      }
    });
    db.close();
  }
  getAllArticles(action) {
    this.get("articles", "*", "title = title", action);
  }
  getArticle(title, action) {
    this.get("articles", "*", "title = '" + this.clean(title) + "'", (articles) => {
      action(articles[0]);
    });
  }
  getUser(username, action) {
    this.get("users", "*", "username = '" + this.clean(username) + "'", (users) => {
      action(users[0]);
    });
  }
  getMessages(action) {
    this.get("messages", "*", "year = year", action);
  }

}
