import rp from "request-promise";

const onexbetURL =
  "https://1xbet.ng/LineFeed/Get1x2_VZip?sports=1&count=50&lng=en&tf=2200000&tz=3&mode=4&country=132&partner=159&getEmpty=true";

const options = {
  url: onexbetURL,
  json: true,
};

const onexbetRoute = (req, res) => {
  rp(options)
    .then(async (data) => await getMatchesOdds(data?.Value, res))
    .catch((err) => {
      return res.status(500).json({ "Error fetching results from 1exbet": err });
    });
};

const getMatchesOdds = async (values, res) => {
  let matches = [];

  values.forEach((value) => {
    let match = {
      tournament: value.L || value.LE,
      team1: value.O1E,
      team2: value.O2E,
      homeOdd: value?.E[0]?.C || undefined,
      drawOdd: value?.E[1]?.C || undefined,
      awayOdd: value?.E[2]?.C || undefined,
    };
    matches.push(match);
  });

  try {
    return res.status(200).json({ length: matches.length, Matches: matches });
  } catch (error) {
    return res.status(500).json({ "Error fetching results from 1xbet": error });
  }
};

export default onexbetRoute;