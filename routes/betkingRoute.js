import rp from "request-promise";

const betkingURL =
  "https://sportsapicdn-desktop.betking.com/api/feeds/prematch/mostpopularsports/en/1/5/4/";

const betkingURL2 =
  "https://sportsapicdn-desktop.betking.com/api/feeds/prematch/lastminute/en/1/15/";

const options = {
  url: betkingURL,
  json: true,
};

const options2 = {
  url: betkingURL2,
  json: true,
};

let allMatches = [];

const betkingRoute = (req, res) => {
  rp(options)
    .then(async (data) => {
      await getMatchesOdds(data, 1);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ "error sending results from betKing": err });
    });

  rp(options2)
    .then(async (data) => {
      await getMatchesOdds(data, 2);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ "error sending results from betKing": err });
    })
    .then(() => {
      try {
        return res.status(200).json({ length: allMatches.length, Matches: allMatches });
      } catch (error) {
        return res.status(500).json({ "error sending results from betKing": error });
      }
    });
};

const getMatchesOdds = async (data, count) => {
  const Items =
    count == 1 ? data[0].AreaMatches[0]?.Items : data.AreaMatches[0]?.Items;

  Items.forEach((item) => {
    const tournament = item?.TournamentName;
    const team1 = item?.ItemName?.split(" - ")[0];
    const team2 = item?.ItemName?.split(" - ")[1];

    let matchOdds = [];

    item?.OddsCollection[0]?.MatchOdds?.forEach((matchOdd) => {
      matchOdds.push(matchOdd?.Outcome?.OddOutcome);
    });

    let match = {
      tournament,
      team1,
      team2,
      homeOdd: matchOdds[0],
      drawOdd: matchOdds[1],
      awayOdd: matchOdds[2],
    };

    allMatches.push(match);
  });
};

export default betkingRoute;
