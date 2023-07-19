const functions = require("./lib/sherdog/index");

functions.getFighter(
  "https://www.sherdog.com/fighter/Stipe-Miocic-39537",
  (fighter, err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(JSON.stringify(fighter, null, 2));
    }
  }
);
