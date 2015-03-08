
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

## Output
```
{
  "name":"Matt Riddle",
  "nickname":"Deep Waters",
  "bio": {
    "age":"29",
    "birthday":"1986-01-14",
    "locality":"Lehighton, Pennsylvania",
    "nationality":"United States",
    "association":"Throwdown",
    "height":"6'1\"",
    "weight":"170 lbs",
    "weight_class":"Welterweight"
  },
  "record": {
    "wins": {
      "total":"8",
      "knockouts": {
        "total":"1",
        "percent":"13"
      },
      "submissions": {
        "total":"1",
        "percent":"13"
      },
      "decisions": {
        "total":"5",
        "percent":"63"
      },
      "others": {
        "total":"1",
        "percent":"13"
      }
    },
    "losses": {
      "total":"3",
      "knockouts": {
        "total":"1",
        "percent":"33"
      },
      "submissions": {
        "total":"0",
        "percent":"0"
      },
      "decisions": {
        "total":"2",
        "percent":"67"
      },
      "others": {
        "total":"",
        "percent":""
      }
    },
    "no_contests":"2"
  },
  "fights":[]
}
```
