var jsonQuery = require('json-query')

var entities = [
{
	"entity": "piccoli",
	"path": "piccoli"
},
{
	"entity": "rodriguez",
	"path": "rodriguez"
},
{
	"entity": "watson",
	"path": "watson"
},
{
	"entity": "edward watson",
	"path": "watson"
},
{
	"entity": "edward",
	"path": "watson"
}
]

module.exports = entities;

// var queryResult = jsonQuery("entity", {
//   data: entities
//   });

//console.log(queryResult.value);