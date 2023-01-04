import rp from "request-promise";
import { load } from "cheerio";

const betwayURL = "https://www.betway.com.ng/sport";

const options = {
  url: betwayURL,
  transform: (body) => load(body),
};

const betwayRoute = (req, res) => {
  rp(options)
    .then(async ($) => await getMatchesOdds($, res))
    .catch((err) => {
      return res.status(500).json({"Error sending results from betway": err });
    });
};

const getMatchesOdds = async ($, res) => {
  let tournaments = [];
  let teams = [];
  let odds = [];
  let matches = [];
  let teamsIndex = 0;
  let oddsIndex = 0;

  $("[data-translate-type=event] > b").each((i, elem) => {
    // teams.push(elem?.attribs["data-translate-key"]);  ==> also works
    teams.push(elem?.children[0]?.data);
  });

  $(".outcome-pricedecimal").each((i, elem) => {
    odds.push(elem?.attribs["data-pd"]);
  });

  $(".label__league_title").each((i, elem) => {
    tournaments.push(elem?.children[2]?.data);
  });

  for (let i = 0; i < tournaments.length; i++) {
    let match = {
      tournament: tournaments[i].trim().split(" ")[0] || undefined,
      team1: teams[teamsIndex].split(" v ")[0].trim() || undefined,
      team2: teams[teamsIndex].split(" v ")[1].trim() || undefined,
      homeOdd: odds[oddsIndex] || undefined,
      drawOdd: odds[oddsIndex + 1] || undefined,
      awayOdd: odds[oddsIndex + 2] || undefined,
    };

    matches.push(match);
    oddsIndex += 3;
    teamsIndex++;
  }

  try {
    return res.status(200).json({ length: matches.length, Matches: matches });
  } catch (error) {
    return res.status(500).json({"Error sending results from betway": error });
  }
};

export default betwayRoute;
