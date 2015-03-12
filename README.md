
# Sherdog Fighter API

Crawls and parses fighter profile data from Sherdog URL

*This api is used in the higher-level [MMA API](https://github.com/valish/mma-api).

## Installation
From source:

```
git clone https://github.com/valish/sherdog-api
cd sherdog-api
npm install
```
From npm:

`npm install sherdog`

## Usage
```
> var sherdog = require('sherdog');
> var url = "http://www.sherdog.com/fighter/Matt-Riddle-34072"
> sherdog.getFighter(url, function(data) {
    console.log(data);
  })
> {
    "name": "Matt Riddle",
    "nickname": "Deep Waters",
    "age": "29",
    "birthday": "1986-01-14",
    "locality": "Lehighton, Pennsylvania",
    "nationality": "United States",
    "association": "Throwdown",
    "height": "6'1\"",
    "weight": "170 lbs",
    "weight_class": "Welterweight",
    "wins": {
        "total": 8,
        "knockouts": 1,
        "submissions": 1,
        "decisions": 5,
        "others": 1
    },
    "losses": {
        "total": 3,
        "knockouts": 1,
        "submissions": 0,
        "decisions": 2,
        "others": 0
    },
    "no_contests": 2,
    "fights": [
        {
            "name": "TFC 27 - Titan Fighting Championship 27",
            "date": "Feb / 28 / 2014",
            "url": "/events/TFC-27-Titan-Fighting-Championship-27-35101",
            "result": "win",
            "method": "Submission (Guillotine Choke)",
            "referee": "David Clifton",
            "round": "2",
            "time": "2:29",
            "opponent": "Michael Kuiper"
        },
        {
            "name": "UFC on Fuel TV 7 - Barao vs. McDonald",
            "date": "Feb / 16 / 2013",
            "url": "/events/UFC-on-Fuel-TV-7-Barao-vs-McDonald-26459",
            "result": "NC",
            "method": "NC (Overturned by Commission)",
            "referee": "Kevin Mulhall",
            "round": "3",
            "time": "5:00",
            "opponent": "Che Mills"
        },
        {
            "name": "UFC 154 - St. Pierre vs. Condit",
            "date": "Nov / 17 / 2012",
            "url": "/events/UFC-154-St-Pierre-vs-Condit-21047",
            "result": "win",
            "method": "Decision (Unanimous)",
            "referee": "Yves Lavigne",
            "round": "3",
            "time": "5:00",
            "opponent": "John Maguire"
        }
        // ... 
    ]
  }
```

