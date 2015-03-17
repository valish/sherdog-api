

//-------------------------------------------------------+
//  Sherdog MMA API
//  sherdog.getFighter(url, callback(data));
//-------------------------------------------------------+

var request = require("request");
var cheerio = require("cheerio");

//-------------------------------------------------------+
//  Get Fighter Profile
//-------------------------------------------------------+

module.exports.getFighter = function(url, callback) {
  request(url, function(error, response, html) {
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
        weight_class: "",
        wins: {
          total: 0,
          knockouts: 0,
          submissions: 0,
          decisions: 0,
          others: 0
        },
        losses: {
          total: 0,
          knockouts: 0,
          submissions: 0,
          decisions: 0,
          others: 0            
        },
        no_contests: 0,
        fights: []
      };
      
      // Fighter name, nickname
      $('h1[itemprop="name"]').filter(function() {
        var el = $(this);
        name = el.find('span.fn').text();
        nickname = el.find('span.nickname').text();
        fighter.name = name;
        fighter.nickname = nickname.replace(/['"]+/g, '');
      });
      
      // Fighter bio
      $('.bio').filter(function() {
        var el = $(this);
        age = el.find('.item.birthday strong').text();
        birthday = el.find('span[itemprop="birthDate"]').text();
        locality = el.find('span[itemprop="addressLocality"]').text();
        nationality = el.find('strong[itemprop="nationality"]').text();
        association = el.find('.item.association span[itemprop="name"]').text();
        height = el.find('.item.height strong').text();
        weight = el.find('.item.weight strong').text();
        weight_class = el.find('.item.wclass strong').text();
        fighter.age = age.slice(5); 
        fighter.birthday = birthday;
        fighter.locality = locality;
        fighter.nationality = nationality;
        fighter.association = association;
        fighter.height = height;
        fighter.weight = weight;
        fighter.weight_class = weight_class;
      });
      
      // Fighter record
      $('.record .count_history').filter(function() {
        var el = $(this);
        var wins = el.find('.left_side .bio_graph').first();
        var winsByKnockout = wins.find('.graph_tag:nth-child(3)');
        var winsBySubmission = wins.find('.graph_tag:nth-child(5)');
        var winsByDecision = wins.find('.graph_tag:nth-child(7)');
        var winsByOther = wins.find('.graph_tag:nth-child(9)');
        var losses = el.find('.left_side .bio_graph.loser');
        var lossesByKnockout = losses.find('.graph_tag:nth-child(3)');
        var lossesBySubmission = losses.find('.graph_tag:nth-child(5)');
        var lossesByDecision = losses.find('.graph_tag:nth-child(7)');
        var lossesByOther = losses.find('.graph_tag:nth-child(9)');
        var noContests = el.find('.right_side .bio_graph');
        var getTotal = function(el) { return parseInt(el.text().split(' ')[0] || 0); }
        var getPercent = function(el) { return el.find('em').text().split('%')[0]; }
        
        wins_total = parseInt(wins.find('.card .counter').text());
        losses_total = parseInt(losses.find('.counter').text());
        no_contests_total = parseInt(noContests.find('.counter').text());        
        fighter.wins.total = wins_total;
        fighter.losses.total = losses_total;
        fighter.no_contests = no_contests_total;
        fighter.wins.knockouts = getTotal(winsByKnockout);
        fighter.wins.submissions = getTotal(winsBySubmission);
        fighter.wins.decisions = getTotal(winsByDecision);
        fighter.wins.others = getTotal(winsByOther);
        fighter.losses.knockouts = getTotal(lossesByKnockout);
        fighter.losses.submissions = getTotal(lossesBySubmission);
        fighter.losses.decisions = getTotal(lossesByDecision);
      });

      // Fighter Fight History
      $('.module.fight_history tr:not(.table_head)').each(function() {
        var el = $(this);
        result = el.find('td:nth-child(1) .final_result').text();
        opponent_name = el.find('td:nth-child(2) a').text();
        opponent_url = el.find('td:nth-child(2) a').attr('href');
        event_name = el.find('td:nth-child(3) a').text();
        event_url = el.find('td:nth-child(3) a').attr('href');
        event_date = el.find('td:nth-child(3) .sub_line').text();
        method = el.find('td:nth-child(4)').text().split(/\)(.*)/)[0] + ")";
        referee = el.find('td:nth-child(4) .sub_line').text();
        round = el.find('td:nth-child(5)').text();
        time = el.find('td:nth-child(6)').text();
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
          opponent: opponent_name
        };

        if (result !== "") {
          fighter.fights.push(fight);
        }
      });
      
      callback(fighter);
    }
  });
}

