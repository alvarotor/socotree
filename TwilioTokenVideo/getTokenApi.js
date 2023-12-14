var express = require("express");
var app = express();
const AccessToken = require("twilio").jwt.AccessToken;

app.listen(3811, () => {
  console.log("Server twilio token api running on port 3811");
});

app.get("/v1/health", (req, res) => {
  res.status(200).send({ success: true });
});

app.get("/getToken", (req, res) => {
  const twilioAccountSid = process.env.TWILIOACCOUNTSID;
  const twilioApiKey = process.env.TWILIOAPIKEY;
  const twilioApiSecret = process.env.TWILIOAPISECRET;

  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret
  );

  console.log("userid==", req.query.userid);
  console.log("roomName==", req.query.roomName);
  token.identity = req.query.userid ? req.query.userid : req.query.identity;

  const videoGrant = new AccessToken.VideoGrant({
    room: req.query.roomName,
  });
  token.addGrant(videoGrant);

  var tokenJwt = token.toJwt()
  console.log("token granted==", tokenJwt);

  res.json(tokenJwt);
});
