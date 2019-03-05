'use strict';

var admin = require("firebase-admin");

var serviceAccount = require("C:\\Users\\mitjain\\Downloads\\IKnow-master (1)\\IKnow-master\\firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://firestore-policy-db.firebaseio.com"
});

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { GoogleSheetsCMS } = require('jovo-cms-googlesheets');


const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb(),
    new GoogleSheetsCMS()
);

var database = admin.firestore();
// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        this.toIntent('WelcomeIntent');
    },

    WelcomeIntent() {
    //     let speech = this.speechBuilder()
    //     .addT('welcome_speech');
    //   this.ask(speech);
        
        this.ask( this.t('welcome.speech') ,this.t('welcome.reprompt'));
    },

    ActionIntent() {
        /**1.Policy Revenue 2. ClaimCost  */
        var userAction =  ""
        userAction = this.$inputs.Action.value
        var amount='0'
        if(userAction != null ) {
            userAction = userAction.toLowerCase()
            if(userAction.includes("revenue") || userAction.includes("income")){
                userAction =1
                amount = '8 Million'
            // all the premiums paid will be the income
            // Create a reference to the cities collection
            var premiumsRef = database.collection("premiums").doc("premium_paid_1");
            
            premiumsRef.get().then(function(doc) {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    console.log("Document data:", doc.get("premium_amount_paid"));
                    console.log("Document data:", doc.get("premium_amount_due"));

                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
           // premiumsRef.

// Create a query against the collection.
            var query = premiumsRef.
                this.ask(this.t('policy.income', { amount: amount }));
            }
            else if (userAction.includes("claim") || userAction.includes("payment") )  {
                userAction =2
                amount = '2 Million'
                this.ask(this.t('claim.costs', { amount: amount }));
            }
            else if ( userAction.includes("underwriting") ) {
                var temp = 0.0;
                userAction =3
             //   amount = '1 Million'
             //   this.ask(this.t('underwriting.costs', { amount: amount }));
                database.collection("underwritingexpenses")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
         
           temp = doc.get("actuarialcosts") + doc.get("meetingcosts") + doc.get("otheroverheads") + doc.get("salariespaid");
          
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    this.ask(this.t('underwriting.costs', { temp: temp }));
            }        
            else if (userAction.includes("profit") || userAction.includes("loss") )  {
                userAction =4
                amount = '4 Million'
                this.ask(this.t('company.networth', { amount: amount }));
           }
    
        }
    },
    HelpIntent() {
        this.ask( 'help.message');
    },
});

module.exports.app = app;
