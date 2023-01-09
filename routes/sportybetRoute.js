import rp from "request-promise";

const sportybetURL =
  "https://www.sportybet.com/api/ng/factsCenter/wapConfigurableEventsByOrder";

const options = {
  url: sportybetURL,
  method: "POST",
  body: {
    order: 0,
    pageNum: 1,
    pageSize: 60,
    productId: 3,
    sportId: "sr:sport:1",
  },
  json: true,
};

const onexbetRoute = (req, res) => {
  rp(options)
    .then(async (data) => await getMatchesOdds(data?.data?.tournaments, res))
    .catch((err) => {
      return res.status(500).json({ "Error fetching results from sportybet": err });
    });
};

const getMatchesOdds = async (data, res) => {
  let matches = [];

  for(let info of data) {
    let match = {
      team1: info?.events[0]?.homeTeamName,
      team2: info?.events[0]?.awayTeamName,
      homeOdd: info?.events[0]?.markets[0]?.outcomes[0]?.odds || undefined,
      drawOdd: info?.events[0]?.markets[1]?.outcomes[0]?.odds || undefined,
      awayOdd: info?.events[0]?.markets[2]?.outcomes[0]?.odds || undefined,
    };
    matches.push(match);
  };

  try {
    return res.status(200).json({ length: matches.length, Matches: matches });
  } catch (error) {
    return res.status(500).json({ "Error fetching results from sportybet": error });
  }
};

export default onexbetRoute;
