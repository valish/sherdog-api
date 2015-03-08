var request = require("request");
var cheerio = require("cheerio");

module.exports.getFighter = function(url, callback) {
  request(url, function(error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      // Fighter JSON object
      var fighter = {
        name: "",
        nickname: "",
        bio: {
          age: "",
          birthday: "",
          locality: "",
          nationality: "",
          association: "",
          height: "",
          weight: "",
          weight_class: ""
        },
        record: {
          wins: {
            total: "",
            knockouts: { total: "", percent: "" },
            submissions: { total: "", percent: ""},
            decisions: { total: "", percent: "" },
            others: { total: "", percent: "" }
          },
          losses: {
            total: "",
            knockouts: { total: "", percent: "" },
            submissions: { total: "", percent: ""},
            decisions: { total: "", percent: "" },
            others: { total: "", percent: "" }            
          },
          no_contests: ""
        },
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
        fighter.bio.age = age.slice(5); 
        fighter.bio.birthday = birthday;
        fighter.bio.locality = locality;
        fighter.bio.nationality = nationality;
        fighter.bio.association = association;
        fighter.bio.height = height;
        fighter.bio.weight = weight;
        fighter.bio.weight_class = weight_class;
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
        var getTotal = function(el) { return el.text().split(' ')[0]; }
        var getPercent = function(el) { return el.find('em').text().split('%')[0]; }
        
        wins_total = wins.find('.card .counter').text();
        losses_total = losses.find('.counter').text();
        no_contests_total = noContests.find('.counter').text();        
        fighter.record.wins.total = wins_total;
        fighter.record.losses.total = losses_total;
        fighter.record.no_contests = no_contests_total;
        fighter.record.wins.knockouts.total = getTotal(winsByKnockout);
        fighter.record.wins.knockouts.percent = getPercent(winsByKnockout);
        fighter.record.wins.submissions.total = getTotal(winsBySubmission);
        fighter.record.wins.submissions.percent = getPercent(winsBySubmission);
        fighter.record.wins.decisions.total = getTotal(winsByDecision);
        fighter.record.wins.decisions.percent = getPercent(winsByDecision);
        fighter.record.wins.others.total = getTotal(winsByOther);
        fighter.record.wins.others.percent = getPercent(winsByOther);
        fighter.record.losses.knockouts.total = getTotal(lossesByKnockout);
        fighter.record.losses.knockouts.percent = getPercent(lossesByKnockout);
        fighter.record.losses.submissions.total = getTotal(lossesBySubmission);
        fighter.record.losses.submissions.percent = getPercent(lossesBySubmission);
        fighter.record.losses.decisions.total = getTotal(lossesByDecision);
        fighter.record.losses.decisions.percent = getPercent(lossesByDecision);
      });
      callback(fighter);
    }
  });
}

