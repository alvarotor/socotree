var express = require('express');
var app = express();
const AccessToken = require('twilio').jwt.AccessToken;

app.listen(3811, () => {
  console.log('Server twilio token api running on port 3811');
});

app.get('/getToken', (req, res, next) => {
  const twilioAccountSid = process.env.TWILIOACCOUNTSID;
  const twilioApiKey = process.env.TWILIOAPIKEY;
  const twilioApiSecret = process.env.TWILIOAPISECRET;

  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
  );

  console.log('identity==', req.query.identity);
  console.log('roomName==', req.query.roomName);
  token.identity = req.query.identity;

  const videoGrant = new AccessToken.VideoGrant({
    room: req.query.roomName,
  });
  token.addGrant(videoGrant);

  //return token.toJwt();
  res.json(token.toJwt());
});
