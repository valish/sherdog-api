//-------------------------------------------------------+
//  Sherdog MMA API
//  sherdog.getFighter(url, callback(data));
//-------------------------------------------------------+

var request = require("request");
var cheerio = require("cheerio");

//-------------------------------------------------------+
//  Get Fighter Profile
//-------------------------------------------------------+

module.exports.getFighter = function (url, callback) {
  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);

      //----------------------------------+
      //  JSON object for Fighter
      //----------------------------------+
      var fighter = {
        name: "",
        nickname: "",
        age: "",
        birthday: "",
        locality: "",
        nationality: "",
        association: "",
        height: "",
        weight: "",
        weightClass: "",
        imageUrl: "",
        wins: {
          total: 0,
          knockouts: 0,
          submissions: 0,
          decisions: 0,
          others: 0,
        },
        losses: {
          total: 0,
          knockouts: 0,
          submissions: 0,
          decisions: 0,
          others: 0,
        },
        noContests: 0,
        draws: 0,
        fights: [],
        isActive: true,
        record: "",
      };

      // Fighter name, nickname
      $(".bio_fighter").filter(function () {
        var el = $(this);
        name = el.find("span.fn").text();
        nickname = el.find("span.nickname").text();
        fighter.name = name;
        fighter.nickname = nickname.replace(/['"]+/g, "");
      });
      // Fighter image
      urlIMG = $(".profile-image-mobile").attr("src");
      fighter.imageUrl = "https://www.sherdog.com" + urlIMG;
      fighter.nationality = $('strong[itemprop="nationality"]').text();
      fighter.locality = $('span[itemprop="addressLocality"]').text();

      // Fighter bio
      $(".bio-holder").filter(function () {
        var el = $(this);
        // age = el.find(".item.birthday strong").text(); /html/body/div[4]/div[3]/div[1]/div/section[1]/div/div[1]/div[2]/div[2]/div[1]/table/tbody/tr[1]/td[2]/b
        //console.log(el.find("table td b"));
        age = el.find("table tbody tr:nth-child(1) td b").text(); //.substring(0, 2);
        //console.log(age);
        birthday = el.find('span[itemprop="birthDate"]').text();
        //locality = el.find('span[itemprop="addressLocality"]').text();
        //nationality = el.find('span item birthplace strong[itemprop="nationality"]').text();
        association = el.find('span[itemprop="name"]').text();
        height = el.find('b[itemprop="height"]').text();
        weight = el.find('b[itemprop="weight"]').text();
        weight_class = el
          .find('div.association-class a[href*="weightclass"]')
          .text();
        //console.log(weight_class);
        fighter.age = age;
        fighter.birthday = birthday;
        //fighter.locality = locality;
        //fighter.nationality = nationality;
        fighter.association = association;
        fighter.height = height;
        fighter.weight = weight;
        fighter.weightClass = weight_class;
      });

      // Fighter record
      $(".winsloses-holder").filter(function () {
        var el = $(this);

        //? WINS

        var wins = parseInt(
          el.find(".wins .win span:nth-child(2)").text() || 0
        );
        //console.log("TOTAL WINS = ", wins);
        var winsByKnockout = parseInt(
          el
            .find('.wins .meter-title:contains("KO / TKO") + .meter .pl')
            .text() || 0
        );
        // console.log("WINS BY KO = ", winsByKnockout);
        var winsBySubmission = parseInt(
          el
            .find('.wins .meter-title:contains("SUBMISSIONS") + .meter .pl')
            .text() || 0
        );
        // console.log("WINS BY SUBMISSION = ", winsBySubmission);
        var winsByDecision = parseInt(
          el
            .find('.wins .meter-title:contains("DECISIONS") + .meter .pl')
            .text() || 0
        );
        // console.log("WINS BY DECISION = ", winsByDecision);
        var winsByOther = parseInt(
          el.find('.wins .meter-title:contains("OTHER") + .meter .pl').text() ||
            0
        );
        //console.log("WINS BY DECISION = ", winsByOther || 0);

        //! Wins are over now we go to lose count
        //console.log("Wins are over now we go to lose count");

        //? LOSES
        var losses = parseInt(
          el.find(".loses .lose span:nth-child(2)").text() || 0
        );
        //console.log("TOTAL LOSSES = ", losses);
        var lossesByKnockout = parseInt(
          el
            .find('.loses .meter-title:contains("KO / TKO") + .meter .pl')
            .text() || 0
        );
        //console.log("LOSSES BY KO = ", lossesByKnockout || 0);
        var lossesBySubmission = parseInt(
          el
            .find('.loses .meter-title:contains("SUBMISSIONS") + .meter .pl')
            .text() || 0
        );
        //console.log("LOSSES BY SUBMISSION = ", lossesBySubmission || 0);
        var lossesByDecision = parseInt(
          el
            .find('.loses .meter-title:contains("DECISIONS") + .meter .pl')
            .text() || 0
        );
        // console.log("LOSSES BY DECISION = ", lossesByDecision || 0);
        var lossesByOther = parseInt(
          el
            .find('.loses .meter-title:contains("OTHERS") + .meter .pl')
            .text() || 0
        );
        // console.log("LOSSES BY OTHER = ", lossesByOther);

        //! Losses are over now we go to draw count
        //console.log("Losses are over now we go to draw count");
        var draws = parseInt(el.find(".draws span:nth-child(2)").text() || 0);

        var noContest = parseInt(
          el.find(".loses .nc span:nth-child(2)").text() || 0
        );
        //console.log("TOTAL NC = ", noContest || 0);
        // console.log("TOTAL DRAWS = ", draws || 0);

        /*
        
        var getTotal = function (el) {
          return parseInt(el.text().split(" ")[0] || 0);
        };
        var getPercent = function (el) {
          return el.find("em").text().split("%")[0];
        };
        
        wins_total = parseInt(wins.find(".card .counter").text());
        losses_total = parseInt(losses.find(".counter").text());
        no_contests_total = parseInt(noContests.find(".counter").text());
        */
        fighter.wins.total = wins;
        fighter.losses.total = losses;
        fighter.draws = draws;
        fighter.noContests = noContest;
        fighter.wins.knockouts = winsByKnockout;
        fighter.wins.submissions = winsBySubmission;
        fighter.wins.decisions = winsByDecision;
        fighter.wins.others = winsByOther;
        fighter.losses.knockouts = lossesByKnockout;
        fighter.losses.submissions = lossesBySubmission;
        fighter.losses.decisions = lossesByDecision;
        fighter.losses.others = lossesByOther;
      });

      // Fighter Fight History
      $(".module.fight_history tr:not(.table_head)").each(function () {
        var el = $(this);
        result = el.find("td:nth-child(1) .final_result").text();
        opponent_name = el.find("td:nth-child(2) a").text();
        opponent_url = el.find("td:nth-child(2) a").attr("href");
        event_name = el.find("td:nth-child(3) a").text();
        event_url =
          "https://www.sherdog.com" + el.find("td:nth-child(3) a").attr("href");
        event_date = el.find("td:nth-child(3) .sub_line").text();
        method =
          el
            .find("td:nth-child(4)")
            .text()
            .split(/\)(.*)/)[0] + ")";
        referee = el.find("td:nth-child(4) .sub_line").text();
        round = el.find("td:nth-child(5)").text();
        time = el.find("td:nth-child(6)").text();
        //----------------------------------+
        //  JSON object for Fight
        //----------------------------------+
        var fight = {
          name: event_name,
          date: event_date,
          url: event_url,
          result: result,
          method: method,
          referee: referee,
          round: round,
          time: time,
          opponent: opponent_name,
        };

        if (result !== "") {
          fighter.fights.push(fight);
        }
      });
      fighter.record =
        fighter.wins.total +
        " - " +
        fighter.losses.total +
        " - " +
        fighter.draws;
      callback(fighter);
    }
  });
};
