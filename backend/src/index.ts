import express from "express";

const app = express();
const PORT = 3000;

// I usually use this GET on the root endpoint to check if the server is working correctly
app.get("/", (_, res) => {
res.send('The server is working correctly!');
});

// This GET will allow you to scrape the Amazon page
app.get("/api/scrape", (req, res) => {
  res.send('Scraping functionality is not implemented yet.');
});

// Tell the server to start listening for requests, that is, "turn on" it
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
