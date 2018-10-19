module.exports = class Session {
  constructor(req) {
    this.id = this.makeRandString(15);
    this.user = {
      isLoggedIn: false,
      username: null,
      name: this.id
    }
    this.last_request = Date.now();
    this.timeout = 1000*60*15; // 15 minutes

    this.requestCount = 0;
    this.requestsHist = [];
    this.requestsTimestamp = [];

    this.logRequest(req)
  }

  makeRandString(size) {
    var text = "";
    const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopkrstuvwxyz1234567890@#$%&(){}[]<>";
    for (let i = 0; i < size; i++) {
      text += possibleChars.charAt(Math.floor(Math.random()*possibleChars.length));
    }
    return text;
  }

  logRequest(req) {
    this.last_request = Date.now();
    this.requestsTimestamp.push(Date.now());
    this.requestsHist.push(req.headers.host + req.baseUrl);
    this.requestCount++;
  }
}
