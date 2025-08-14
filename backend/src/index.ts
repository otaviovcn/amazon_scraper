import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";

const app = express();
const PORT = 3000;

// I usually use this GET on the root endpoint to check if the server is working correctly
app.get("/", (_, res) => {
  res.send('The server is working correctly!');
});

// This GET will allow you to scrape the Amazon page
app.get("/api/scrape", async (req, res) => {
  const { keyword } = req.query;

  try {
    const response = await axios.get(
      `https://www.amazon.com/s?k=${keyword}`,
      {
        // The 'headers', which is an optional parameter, is used so that
        //  when the GET request is made, it appears to be a browser request.
        headers: {
          "User-Agent": "Mozilla/5.0"
        },
      });
    //This part is to make a copy of the original DOM, so that it is not 
    // necessary to have the page open to make the necessary manipulations
    const dom: JSDOM = new JSDOM(response.data);
    const document: Document = dom.window.document;

    // Relevant scraping data will be added here
    const results: { title: string; image: string; rating: string; reviews: string; }[] = [];

    // Here will be the capture of relevant data
    document.querySelectorAll('.s-card-container').forEach((product) => {
      const title = product.querySelector('h2')?.textContent.trim();
      const image = document.querySelector('img')?.src;
      const rating = document.querySelector('.mvt-review-star-mini-popover')?.
        getAttribute('aria-label')?.trim();
      const reviews = product.querySelector('.puis-normal-weight-text')?.textContent.trim();

      if (title && image && rating && reviews) {
        results.push({ title, image, rating, reviews });
      }
    });

    // The results are sent in JSON format
    res.json(results);
  } catch (err) {
    console.error("Error scraping Amazon:", err);
    res.status(500).json({ error: "Failed to scrape Amazon" });
  }

});

// Tell the server to start listening for requests, that is, "turn on" it
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
