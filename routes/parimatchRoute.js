import rp from "request-promise";
import { load } from "cheerio";

// URL'S

const parimatchURL1 = "https://parimatch.ng/football/upcoming/1";

const parimatchURL2 = "https://parimatch.ng/football/upcoming/2";

const parimatchURL3 = "https://parimatch.ng/football/upcoming/3";

const parimatchURL4 = "https://parimatch.ng/football/upcoming/4";

const parimatchURL5 = "https://parimatch.ng/football/upcoming/4";


// rp options

const options1 = {
  url: parimatchURL1,
  transform: (body) => load(body),
};

const options2 = {
  url: parimatchURL2,
  transform: (body) => load(body),
};

const options3 = {
  url: parimatchURL3,
  transform: (body) => load(body),
};

const options4 = {
  url: parimatchURL4,
  transform: (body) => load(body),
};

const options5 = {
  url: parimatchURL5,
  transform: (body) => load(body),
};


// store all scraped matches

let allMatches = [];


// functions

const parimatchRoute = (req, res) => {
  rp(options1)
    .then(async ($) => {
      await getMatchesOdds($);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ "Error fetching results from parimatch": err });
    });

  rp(options2)
    .then(async ($) => {
      await getMatchesOdds($);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ "Error fetching results from parimatch": err });
    });

  rp(options3)
    .then(async ($) => {
      await getMatchesOdds($);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ "Error fetching results from parimatch": err });
    });

  rp(options4)
    .then(async ($) => {
      await getMatchesOdds($);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ "Error fetching results from parimatch": err });
    });

  rp(options5)
    .then(async ($) => {
      await getMatchesOdds($);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ "Error fetching results from parimatch": err });
    });

  if (allMatches[0]) {
    try {
      return res
        .status(200)
        .json({ length: allMatches.length, Matches: allMatches });
    } catch (error) {
      return res
        .status(500)
        .json({ "Error fetching results from parimatch": error });
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
