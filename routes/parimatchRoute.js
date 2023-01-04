import rp from "request-promise";
import { load } from "cheerio";

const parimatchURL =
  "https://parimatch.ng/paginated-events/football/prematch?pageNumber=1";

const parimatchURL2 =
  "https://parimatch.ng/paginated-events/football/prematch?pageNumber=2";

const options = {
  url: parimatchURL,
  transform: (body) => load(body),
};

const options2 = {
  url: parimatchURL2,
  transform: (body) => load(body),
};

let allMatches = [];

const parimatchRoute = (req, res) => {
  rp(options)
    .then(async ($) => {
      await getMatchesOdds($);
    })
    .catch((err) => {
      return res.status(500).json({"Error sending results from parimatch": err });
    });

  rp(options2)
    .then(async ($) => {
      await getMatchesOdds($);
    })
    .catch((err) => {      
      return res.status(500).json({"Error sending results from parimatch": err });
    });

  if (allMatches[0]) {
    try {
      return res.status(200).json({ length: allMatches.length, Matches: allMatches });
    } catch (error) {
      return res.status(500).json({"Error sending results from parimatch": error });
    }
  }
};


const getMatchesOdds = async ($) => {
  let teams = [];
  let odds = [];
  let teamsIndex = 0;
  let oddsIndex = 0;

  $(".event-card__wrapper").each((i, parent) => {
    const team1 =
      parent?.children[0]?.next?.children[3].children[1].children[1].children[0]
        .data;

    const team2 =
      parent?.children[0]?.next?.children[3].children[1].children[3].children[0]
        .data;

    const homeOdd =
      parent?.children[2]?.next?.children[3]?.children[3]?.children[1]
        ?.children[1]?.children[0]?.data;

    const drawOdd =
      parent?.children[2]?.next?.children[3]?.children[3]?.children[3]
        ?.children[1]?.children[0]?.data;

    const awayOdd =
      parent?.children[2]?.next?.children[3]?.children[3]?.children[5]
        ?.children[1]?.children[0]?.data;

    teams.push({ team1: team1, team2: team2 });
    odds.push({ home: homeOdd, draw: drawOdd, away: awayOdd });
  });

  let countdown = odds.length;

  while (countdown > 0) {
    let match = {
      team1: teams[teamsIndex].team1,
      team2: teams[teamsIndex].team2,
      homeOdd: odds[oddsIndex].home,
      drawOdd: odds[oddsIndex].draw,
      awayOdd: odds[oddsIndex].away,
    };

    teamsIndex++;
    oddsIndex++;
    countdown--;

    allMatches.push(match);
  }
};

export default parimatchRoute;
