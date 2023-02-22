

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
        // age: "",
        birthday: "",
        locality: "",
        nationality: "",
        association: "",
        height: 0,
        weight: "",
        image_url: "",
        image_flag: "",
        weight_class: "",
        wins: {
          total: 0,
          knockouts: 0,
          submissions: 0,
          decisions: 0,
          knockouts_percent: 0,
          submissions_percent: 0,
          decisions_percent: 0,
          others: 0
        },
        losses: {
          total: 0,
          knockouts: 0,
          submissions: 0,
          decisions: 0,
          knockouts_percent: 0,
          submissions_percent: 0,
          decisions_percent: 0,
          others: 0            
        },
        no_contests: 0,
        fights: []
      };
      
      // Fighter name, nickname
      $('.bio_fighter').filter(function() {
        var el = $(this);
        el.name = el.find('span.fn').text();
        nickname = el.find('span.nickname').text();
        fighter.name = el.name;
        fighter.nickname = nickname.replace(/['"]+/g, '');
      });

      // Fighter image
      fighter.image_url = $(".fighter-info > div:nth-child(1) > img").attr("src");
      fighter.image_flag = $(".big_flag").attr("src");
      
      // Fighter bio
      $('.fighter-right').filter(function() {
        var el = $(this);
        birthday = el.find('tr:nth-child(1) > td:nth-child(2)').text();
        locality = el.find('span[itemprop="addressLocality"]').text();
        nationality = el.find('strong[itemprop="nationality"]').text();
        fighter.birthday = birthday;
        fighter.locality = locality;
        fighter.nationality = nationality;
        // weight_class = el.find('.item.wclass strong').text();
        // fighter.weight_class = weight_class;
      });
      
      //HEIGHT / WIDTH
      $('.bio-holder').filter(function() {
        var el = $(this);
        // height = el.find('tr:nth-child(2) > td:nth-child(2) > b[itemprop="height"]').text();
        height = el.find('tr:nth-child(2) > td:nth-child(2)').text();
        weight = el.find('tr:nth-child(3) > td:nth-child(2)').text();
        weight_class = el.find('div > a').text();
        fighter.height = height;
        fighter.weight = weight;
        fighter.weight_class = weight_class;
      });
      
      //ASSOCIATION
      $('.association-class').filter(function() {
        var el = $(this);
        association = el.find('.association span[itemprop="name"]').text();
        fighter.association = association;
      });
      
      //WIN / LOSS
      $('.winsloses-holder').filter(function() {
        var el = $(this);
        //WIN
        wins_total = el.find('.win > span:nth-child(2)').text();
        fighter.wins.total = parseInt(wins_total);
        //WIN_KNOCKOUTS
        knockouts_total = el.find('.wins > div:nth-child(3) > .pl').text();
        fighter.wins.knockouts = parseInt(knockouts_total);
        knockouts_percent = el.find('.wins div:nth-child(3) > .pr').text();
        fighter.wins.knockouts_percent = parseInt(knockouts_percent);
        //WIN_SUBMISSION_TOTAL
        submissions_total = el.find('.wins > div:nth-child(5) > .pl').text();
        fighter.wins.submissions = parseInt(submissions_total);
        submissions_percent = el.find('.wins > div:nth-child(5) > .pr').text();
        fighter.wins.submissions_percent = parseInt(submissions_percent);
        //WIN_DECISION_TOTAL
        decisions_total = el.find('.wins > div:nth-child(7) > .pl').text();
        fighter.wins.decisions = parseInt(decisions_total);
        decisions_percent = el.find('.wins > div:nth-child(7) > .pr').text();
        fighter.wins.decisions_percent = parseInt(decisions_percent);
        
        //-----------------------+
        //LOSS
        //-----------------------+
        loss_total = el.find('.lose > span:nth-child(2)').text();
        fighter.losses.total = parseInt(loss_total);
        //LOSS_KNOCKOUTS
        knockouts_total = el.find('.loses > div:nth-child(3) > .pl').text();
        fighter.losses.knockouts = parseInt(knockouts_total);
        knockouts_percent = el.find('.loses div:nth-child(3) > .pr').text();
        fighter.losses.knockouts_percent = parseInt(knockouts_percent);
        //LOSS_SUBMISSION_TOTAL
        submissions_total = el.find('.loses > div:nth-child(5) > .pl').text();
        fighter.losses.submissions = parseInt(submissions_total);
        submissions_percent = el.find('.loses > div:nth-child(5) > .pr').text();
        fighter.losses.submissions_percent = parseInt(submissions_percent);
        //LOSS_DECISION_TOTAL
        decisions_total = el.find('.loses > div:nth-child(7) > .pl').text();
        fighter.losses.decisions = parseInt(decisions_total);
        decisions_percent = el.find('.loses > div:nth-child(7) > .pr').text();
        fighter.losses.decisions_percent = parseInt(decisions_percent);
      });

      // Fighter record
      // $('.winsloses-holder').filter(function() {
      //   var el = $(this);
      //   var wins = el.find('.wins ').first();
      //   var winsByKnockout = wins.find('.graph_tag:nth-child(3)');
      //   var winsBySubmission = wins.find('.graph_tag:nth-child(5)');
      //   var winsByDecision = wins.find('.graph_tag:nth-child(7)');
      //   var winsByOther = wins.find('.graph_tag:nth-child(9)');
      //   var losses = el.find('.winsloses-holder.loser');
      //   var lossesByKnockout = losses.find('.graph_tag:nth-child(3)');
      //   var lossesBySubmission = losses.find('.graph_tag:nth-child(5)');
      //   var lossesByDecision = losses.find('.graph_tag:nth-child(7)');
      //   var lossesByOther = losses.find('.graph_tag:nth-child(9)');
      //   var noContests = el.find('.right_side .winsloses-holder');
      //   var getTotal = function(el) { return parseInt(el.text().split(' ')[0] || 0); }
      //   var getPercent = function(el) { return el.find('em').text().split('%')[0]; }
        
      //   wins_total = parseInt(wins.find('.winloses .win').text());
      //   losses_total = parseInt(losses.find('.counter').text());
      //   no_contests_total = parseInt(noContests.find('.counter').text());        
      //   fighter.wins.total = wins_total;
      //   fighter.losses.total = losses_total;
      //   fighter.no_contests = no_contests_total;
      //   fighter.wins.knockouts = getTotal(winsByKnockout);
      //   fighter.wins.submissions = getTotal(winsBySubmission);
      //   fighter.wins.decisions = getTotal(winsByDecision);
      //   fighter.wins.others = getTotal(winsByOther);
      //   fighter.losses.knockouts = getTotal(lossesByKnockout);
      //   fighter.losses.submissions = getTotal(lossesBySubmission);
      //   fighter.losses.decisions = getTotal(lossesByDecision);
      // });

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
          opponent: opponent_name,
          opponent_url: opponent_url
        };

        if (result !== "") {
          fighter.fights.push(fight);
        }
      });
      
      callback(fighter);
    }
  });
}

