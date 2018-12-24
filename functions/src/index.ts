import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const createUser = functions.https.onRequest((request, response) => {
    console.log('User Created from firebase')
    response.send("User Created from Firebase!");
});
