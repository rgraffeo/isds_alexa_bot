

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
    "Facts": function (intent, session, response) {
        
        //get the session attributes
        var sessionAttributes = session.attributes;
        
        //get the value of the intent's slot
        var fact_category = intent.slots.category.value

        //if (!fact_category) {var fact_category = getFunFactCat(intent,false)};

        var shouldEndSession = false;
        var session_type = sessionAttributes.type;
        

        if(fact_category){
            if(fact_category == "random"){
                var random2 = 2.9
                var outputSpeech = funfacts[Object.keys(funfacts)[Math.floor(Math.random() * (random2))]][Math.floor(Math.random() * (random))];
                //var outputSpeech = funfacts[fact_category][Math.floor(Math.random() * (random))];
                var repromptText = "do you want to hear another random fact? You can also ask me about students,professors, and the department";
                response.ask(outputSpeech,repromptText);    
            } else if (fact_category =="professors" || fact_category == "students" || fact_category== "courses") {
                var outputSpeech = funfacts[fact_category][Math.floor(Math.random() * (random))];
                var repromptText = "do you want to hear another fact about"+ " " +fact_category;
                
                var persistent = {};
                persistent = {
                    prompted: true,
                    fact_category: fact_category};
                session.attributes = persistent;

                response.ask(outputSpeech,repromptText);
                callback(session.attributes);

            } else {
                var outputSpeech = "Do you want to hear a random or specific fact?";
                var repromptText = "Say random or specific"
                response.ask("You can ask me about students, professors, and courses. Which one do you like");
            }
        } else {
            response.ask("You can ask me about students, professors, and courses. Which one do you like");
        }
    },
    "SpeechName": function(intent, session, response) {
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

        session.attributes = {};
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
        var sessionAttributes = session.attributes;
        var cat = sessionAttributes.cat;

        IsdsBotIntent(intent, session, response);
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the IsdsBot skill.
    var isdsbot = new IsdsBot();
    isdsbot.execute(event, context);
};



// Create function to test the presence of the slot in the intent
function getFunFactCat(intent,assignDefault) {
    var cat = intent.slots.category
    if (!cat || !cat.value) {
        if(assignDefault){        
            var cat = 'students';
            return cat
        }
    }
    else {
        return cat.value
    }
};


function IsdsBotIntent (intent, session, response) {
        //var cat = intent.slots.category.value;
        
        
        var sessionAttributes = session.attributes;
        var cat = sessionAttributes.cat;

        if (!cat) {var cat = getFunFactCat(intent,false)};
        //var cat = getFunFactCat(intent,false);

        var shouldEndSession = false;
        
        if(cat){
            if(cat == "random"){
                var random2 = 2.9
                var outputSpeech = funfacts[Object.keys(funfacts)[Math.floor(Math.random() * (random2))]][Math.floor(Math.random() * (random))];
                //var outputSpeech = funfacts[cat][Math.floor(Math.random() * (random))];
                var repromptText = "do you want to hear another random fact? You can also ask me about students,professors, and the department";
                response.ask(outputSpeech,repromptText);    
            } else if (cat =="professors" || cat == "students" || cat== "courses") {
                var outputSpeech = funfacts[cat][Math.floor(Math.random() * (random))];
                var repromptText = "do you want to hear another fact about"+ " " +cat;
                
                var persistent = {};
                persistent = {
                    prompted: true,
                    cat: cat};
                session.attributes = persistent;

                response.ask(outputSpeech,repromptText);
                callback(session.attributes);

            } else {
                response.ask("You can ask me about students, professors, and courses. Which one do you like");
            }
        } else {
            response.ask("You can ask me about students, professors, and courses. Which one do you like");
        }
    };