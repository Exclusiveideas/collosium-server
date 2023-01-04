import express from "express"
import cors from "cors"
import onexbetRoute from "./routes/onexbetRoute.js"
import betwayRoute from "./routes/betwayRoute.js"
import parimatchRoute from "./routes/parimatchRoute.js"
import betnaijaRoute from "./routes/betnaijaRoute.js"
import betkingRoute from "./routes/betkingRoute.js"

const app = express();
app.use(cors({}));

app.get("/api/onexbet", onexbetRoute);
app.get("/api/betway", betwayRoute);
app.get("/api/parimatch", parimatchRoute);
app.get("/api/betking", betkingRoute);
app.get("/api/betnaija", betnaijaRoute);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`app is running on port ${PORT}`));