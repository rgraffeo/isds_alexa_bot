

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');


var random = 5.9;
//var correctAnswerIndex =  Math.floor(Math.random() * (random));


var funfacts = {
    students:   [
            "we have the tallest and arguably nicest phd students of the hole business school",
            "we love to work from home during weekends",
            "the business school is our second home",
            "we pretend to know about computers and business",
            "the I.S.D.S students get good jobs",
            "the I.S.D.S students get the highest salary in the business school"],
    professors: [
            "I.S.D.S professors publish a lot",
            "I.S.D.S professors love to teach",
            "I.S.D.S professors engage in very interesting projects",
            "I.S.D.S professors like to work with students one on one",
            "I.S.D.S professors are fun people",
            "I.S.D.S professors work hard and play harder"],
    courses: [
            "I.S.D.S courses prepare you for a great career",
            "idsds courses are challenging but fun",
            "many students from other departments take I.S.D.S courses ",
            "I.S.D.S courses are hands on and provide with grat skills",
            "I.S.D.S courses are both technical and strategic",
            "I.S.D.S courses will get you a job"]
    };



var IsdsBot = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
IsdsBot.prototype = Object.create(AlexaSkill.prototype);
IsdsBot.prototype.constructor = IsdsBot;

IsdsBot.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("IsdsBot onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

IsdsBot.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("IsdsBot onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Hi! I'm the the I.S.D.S assistant. I'm here to help you. What's your name?";
    var repromptText = "Sorry, I didn't catch that. Say, my name is";
    
    var attributes = {
            type: launchRequest.type
        };
    session.attributes = attributes;
    
    response.ask(speechOutput, repromptText);
    callback(session.attributes);

};

IsdsBot.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("IsdsBot onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

IsdsBot.prototype.intentHandlers = {
    // register custom intent handlers
    "Consultant": function (intent, session, response) {
        var sessionAttributes = session.attributes;

        var outputSpeech = "Ok ";
        var repromptText = "";

        response.ask(outputSpeech, repromptText);


    },
    "Facts": function (intent, session, response) {
        
        //get the value of the intent's slot
        var sessionAttributes = session.attributes

        if (intent.slots.hasOwnProperty("category")) {
            var Fact_Category = intent.slots.category.value;    
        } else if ("FactCategory" in sessionAttributes) {
            var Fact_Category = sessionAttributes.FactCategory;
        };

        /*else if (session.attributes.FactCategory){
            var Fact_Category = session.attributes.FactCategory;
        };*/
        

        var shouldEndSession = false;
        //var session_type = sessionAttributes.type.Fact_Category;        

        if(Fact_Category){
            if(Fact_Category == "random"){
                var random2 = 2.9
                var outputSpeech = funfacts[Object.keys(funfacts)[Math.floor(Math.random() * (random2))]][Math.floor(Math.random() * (random))];
                //var outputSpeech = funfacts[Fact_Category][Math.floor(Math.random() * (random))];
                var repromptText = "do you want to hear another random fact? You can also ask me about students,professors, and the department";
                response.ask(outputSpeech,repromptText);    
            } else if (Fact_Category =="professors" || Fact_Category == "students" || Fact_Category== "courses") {
                var outputSpeech = funfacts[Fact_Category][Math.floor(Math.random() * (random))];
                var repromptText = "do you want to hear another fact about"+ " " + Fact_Category;

                var session_attributes = {};
                session_attributes = {
                    //Prompted: true,
                    FactCategory: Fact_Category};
                session.attributes = session_attributes;

                response.ask(outputSpeech,repromptText);                
                callback(session.attributes);

            } else {
                var outputSpeech = "You can ask me about students, professors, or courses";
                var repromptText = "Ask me for a random fact if you prefer";
                response.ask(outputSpeech,repromptText);
            }
        } else {
            var outputSpeech = "You can ask me about students, professors, or courses";
            var repromptText = "Ask me for a random fact if you prefer";
            response.ask(outputSpeech,repromptText);
        }
        
    },
    "SpeechName": function (intent, session, response) {
        var shouldEndSession = true;
        var intent_value = intent.slots.name.value;
        var session_type = session.attributes.type;


        //if the previous interaction was launch the skill
        if (intent_value && session_type == "LaunchRequest"){
        var outputSpeech = "Hi " + intent_value + "!. You can ask me general info about the department, or you can ask for advice for selecting your courses"
        response.ask(outputSpeech);
        } else if (intent_value == undefined && session_type == "LaunchRequest"){
        var outputSpeech = "Can you say that again? Say: my name is";
        response.ask(outputSpeech);
        }

        session.attributes = "pippo";
        callback(session.attributes);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("Try asking me a fun fact about professors maybe?");
    },
    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye, thanks for taking some time to get to know the I.S.D.S department";
        response.tell(speechOutput);
    },
    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye, thanks for taking some time to get to know the I.S.D.S department";
        response.tell(speechOutput);
    },    
    "AMAZON.YesIntent": function (intent, session, response) {
        
        var intent = intent;
        var session = session;
        var response = response;
        
        //response.tell(session.attributes.FactCategory)
        //IsdsBot.prototype.intentHandlers.Facts();
        //Facts(intent, session, response);

        intentName = "Facts";
        intentCall = this.Facts;
        //console.log('dispatch intent = ' + intentName);
        //intentCall.call(this, intent, session, response);

    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the IsdsBot skill.
    var isdsbot = new IsdsBot();
    isdsbot.execute(event, context);
};

