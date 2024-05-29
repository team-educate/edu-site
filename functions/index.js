const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall(async (data, context) => {
    //Check if the uer is admin or not
    if (!context.auth.token.admin) {
        return "You don't have access to make someone admin"
    }
    //Get user and add custom claim
    return admin.auth().getUserByEmail(data.email).then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        })
    }).then(() => {
        return `Success! ${data.email} has become an admin.`;
    }).catch((error) => {
        return error;
    })
})

exports.createCustomUser = functions.https.onCall(async (data, context) => {
    return admin.auth().createUser({
        uid: data.uid,
        email: data.email,
        emailVerified: false,
        password: data.password,
        disabled: false,
        displayName: data.displayName,
        photoURL: data.photoURL
    }).then(userRecord => {
        return "Successfully created user: " + userRecord.uid;
    }).catch(error => {return error})
})

exports.findUserByEmail = functions.https.onCall(async (data, context) => {
    return admin.auth().getUserByEmail(data.email).then(user => {return user}).catch(error => {return error})
})