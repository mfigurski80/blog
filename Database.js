const sqlite3 = require('sqlite3').verbose();

// Actual sqlite3 Database
// Export it as a module
module.exports = class Database {
  constructor(pathTo) {
    this.pathTo = pathTo;
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
    this.run("INSERT INTO articles (title, content, day, month, year, type, image) VALUES ('" + title + "', '" + content + "', " + day + ", '" + month + "', " + year + ", '" + type + "', '" + imageFile + "')");
  }
  deleteArticle(title) {
    this.run("DELETE FROM articles WHERE title = '" + title + "'");
  }
  updateArticle(title, newtitle, content) {
    this.run("UPDATE articles SET title = '" + newtitle + "', content = '" + content + "' WHERE title = '" + title + "'")
  }
  addUser(username, password, name, salt, bio="") {
    this.run("INSERT INTO users (username, password, name, salt, bio) VALUES ('" + username + "', '" + password + "', '" + name + "', '" + salt + "', '" + bio + "')");
  }


  addMessage(name, email, message) {
    const d = new Date();
    const day = d.getDate();
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
    const year = d.getFullYear();
    this.run("INSERT INTO messages (name, email, message, day, month, year) VALUES ('" + name + "', '" + email + "', '" + message + "', " + day + ", '" + month + "', " + year + ")");
  }
  addSessionData(key, requestCount, requestsHist, requestsTimestamp) {
    this.run("INSERT INTO sessionData (key, requestCount, requestsHist, requestsTimestamp) VALUES ('" + key + "', " + requestCount + ", '" + requestsHist + "', '" + requestsTimestamp + "')");
  }


  // gets given item from given table, with callback function... used for reading data
  get(table, selection, condition, action) {
    const db = new sqlite3.Database(this.pathTo);
    db.all("SELECT " + selection + " FROM " + table + " WHERE " + condition, [], action);
    db.close();
  }
  getAllArticles(action) {
    this.get("articles", "*", "title = title", action);
  }
  getArticle(title, action) {
    this.get("articles", "*", "title = '" + title + "'", action);
  }
  getUser(username, action) {
    this.get("users", "*", "username = '" + username + "'", action);
  }
  getMessages(action) {
    this.get("messages", "*", "year = year", action);
  }

}
