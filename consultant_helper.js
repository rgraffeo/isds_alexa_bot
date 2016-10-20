'use strict';
module.change_code = 1;
var _ = require('lodash');

function ConsultHelp(obj) {
	  this.started = false;
  	this.index = 0;
  	this.currentStep = 0;
  	this.consultant = [
  	{	
  		init: ", i'll ask you some personal info in order to suggest you the best course tailored for skills" + ". lets start with the first one.",
  		steps: [
  		{
  			value: null,
  			promt: "are you a bachelor student?",
  			help: "are you a bachelor student?"
  		},
  		{
  		  value: null,
  			promt: "do you like quantitave courses?",
  			help: "do you like quantitave courses?"	
  		},
  		{
  			value: null,
  			promt: "do you like finalcial subjects?",
  			help: "do you like finalcial subjects?"
  		},
      {
        value: null,
        promt: "would you like to challenge yourself and learn how to program?",
        help: "would you like to challenge yourself and learn how to program?"
      }      

  		]
  	}

  	];
    for (var prop in obj) this[prop] = obj[prop];
}



module.exports = ConsultHelp;


var consultHelp = new ConsultHelp()
var data = consultHelp.consultant[0].steps
//console.log(data)
//console.log(_.filter(data, function(o) { return !o.promt; }));
console.log(_.filter(data, ["value", null]));

/*
var consultHelp = new ConsultHelp()
console.log(consultHelp.started == false)
console.log(typeof(consultHelp))
console.log(consultHelp.consultant[0].steps.length)

var stepValue = consultHelp.currentStep
var speechOutput = consultHelp.consultant[0].steps[0].promt
console.log(speechOutput)
*/