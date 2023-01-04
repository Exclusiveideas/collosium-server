import rp from "request-promise";
import { load } from "cheerio";

const LIMIT = 50;

const betnaijaURL = `https://sports.bet9ja.com/desktop/feapi/PalimpsestAjax/GetEventsInDailyBundleV3?DISP=1000&DISPH=0&SPORTID=1&LIMIT=${LIMIT}&v_cache_version=1.214.3.135`;

const options = {
  url: betnaijaURL,
  json: true,
};

let matches = [];

const betnaijaRoute = (req, res) => {
  rp(options)
    .then(async (data) => {
      await getMatchesOdds(data);
    })
    .then(() => {
      try {
        return res.status(200).json({ length: matches.length, Matches: matches });
      } catch (error) {
        return res.status(500).json({"Error sending results from betnaija": error });
      }
    })
    .catch((err) => {
      return res.status(500).json({"Error sending results from betnaija": err });
    });
};

const getMatchesOdds = async (data) => {
  const matchInfo = data?.D?.E;

  matchInfo.forEach((info) => {
    const team1 = info?.N?.split(" - ")[0];
    const team2 = info?.N?.split(" - ")[1];

    const homeOdd = info?.O?.S_1X2_1;
    const drawOdd = info?.O?.S_1X2_X;
    const awayOdd = info?.O?.S_1X2_2;

    const timeOfMatch = `${info?.D.split(" ")[1]} + 1`;

    const match = {
      timeOfMatch,
      team1,
      team2,
      homeOdd,
      drawOdd,
      awayOdd,
    };

    matches.push(match);
  });

};

export default betnaijaRoute;
