
# sherdog-api

Retrieves fighter information from Sherdog URL

## Installation

Use NPM:
`npm install sherdog`

## Usage
```
var sherdog = require('sherdog');
var url = "http://www.sherdog.com/fighter/Matt-Riddle-34072"
sherdog.getFighter(url, function(data) {
  console.log(data);
})
```