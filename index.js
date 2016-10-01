/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Greeter to say hello"
 *  Alexa: "Hello World!"
 */

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


/**
 * HelloWorld is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var HelloWorld = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HelloWorld.prototype = Object.create(AlexaSkill.prototype);
HelloWorld.prototype.constructor = HelloWorld;

HelloWorld.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HelloWorld onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

HelloWorld.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HelloWorld onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Hi! I'm the the I.S.D.S assistant. I'm here to help you. What's your name?";
    var repromptText = "Sorry, I didn't catch that. Say, my name is";
    
    
    var attributes = {
            type: launchRequest.type
        };
    session.attributes = attributes;
    
    response.ask(speechOutput, repromptText);
    callback(session.attributes);

};

HelloWorld.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("HelloWorld onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

HelloWorld.prototype.intentHandlers = {
    // register custom intent handlers
    "HelloWorldIntent": function (intent, session, response) {
        //var cat = intent.slots.category.value;
        
        var sessionAttributes = session.attributes;
        //var cat = sessionAttributes.cat;

        var cat = intent.slots.category.value

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

        HelloWorldIntent(intent, session, response);
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var helloWorld = new HelloWorld();
    helloWorld.execute(event, context);
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


function HelloWorldIntent (intent, session, response) {
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