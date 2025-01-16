const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const { repository } = req.body;
  const { username, forkedRepo, accessToken } = req.query;

  if (repository && username && forkedRepo && accessToken) {
    try {
      await axios.post(
        `https://api.github.com/repos/${username}/${forkedRepo}/dispatches`,
        { event_type: "sync" },
        {
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      res.status(200).send("Dispatch triggered successfully");
    } catch (error) {
      console.error(
        "Error triggering dispatch:",
        error.response?.data || error.message
      );
      res.status(500).send("Error triggering dispatch");
    }
  } else {
    res.status(400).send("Missing required parameters");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
