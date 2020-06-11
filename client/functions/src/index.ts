import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.register = functions
  .region('europe-west1')
  .https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'GET');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
    }

    if (req.method !== 'POST') {
      res.status(400).send('what are you trying baby?');
    }

    const email = req.body.email;
    const pass = req.body.pass;

    admin
      .auth()
      .createUser({
        email: email,
        emailVerified: true,
        password: pass,
      })
      .then((userRecord) => {
        console.log('User ' + email + 'created');
        res.send({ uid: userRecord.uid, email: userRecord.email });
      })
      .catch((error) => {
        res.status(500).send(`Error creating new user: ${error.message}`);
      });
  });
