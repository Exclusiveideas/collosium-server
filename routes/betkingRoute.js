import rp from "request-promise";


const betkingRoute = (req, res) => {
  const { team1, team2} = req?.query;

  let firstThird = (team1?.slice(0, 3)).toLowerCase();

  const teams = {
    team1,
    team2,
  }

  rp({
    url: `https://sportsapicdn-desktop.betking.com/api/feeds/prematch/Search/lang/en?search=${firstThird}`,
    json: true,
  })
    .then(async (data) => {
      const matchInfo = await getMatchInfo(data, teams);

      return res.status(200).json({ bookie: "betking", matchInfo });
    })
    .catch((err) => {
      return res.status(500).json({ "error fetching results from betKing": err });
    });
};

const getMatchInfo = async (data, teams) => {
  let matchInfo = {};

  for(let i = 0; i < data?.length; i++) {
    let simTeam1 = Math.round(
      similarity(data[i]?.TeamHome, teams?.team1) * 100
    );

    let simTeam2 = Math.round(
      similarity(data[i]?.TeamAway, teams?.team2) * 100
    );

    if (simTeam1 > 40 && simTeam2 > 40) {

      matchInfo = {
        team1: data[i]?.TeamHome,
        team2: data[i]?.TeamAway,
        homeOdd: data[i]?.Markets[0]?.Markets[0]?.OddOutcome,
        drawOdd: data[i]?.Markets[0]?.Markets[1]?.OddOutcome,
        awayOdd: data[i]?.Markets[0]?.Markets[2]?.OddOutcome,
        tournament: data[i]?.TournamentName,
      };

      break;
    }
  }

  return matchInfo;
};



// calculate string simialrity

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

export default betkingRoute;