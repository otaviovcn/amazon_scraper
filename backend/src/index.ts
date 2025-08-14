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

  // If the 'keyword' parameter is not provided, an error message will be returned
  if (!keyword) {
    return res.status(400).json({ error: "Parameter 'keyword' is required" });
  }

  try {
    // The 'headers', which is an optional parameter, is used so that
    //  when the GET request is made, it appears to be a browser request.
    // The Amazon was blocking it and this is to avoid being blocked by Amazon's anti-scraping measures
    const response = await axios.get(
      `https://www.amazon.com/s?k=${keyword}`,
      {
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

      /* "The request wasn't getting much success with these two selectors below, but 
      the AI suggested creating "more resilient" selectors to try to escape Amazon's analysis"
      -> const rating = document.querySelector('.mvt-review-star-mini-popover')?.getAttribute('aria-label')?.trim();
      -> const reviews = product.querySelector('.puis-normal-weight-text')?.textContent.trim();*/

      const title: string | undefined = product.querySelector('h2')?.textContent?.trim();
      const image: string | undefined = product.querySelector('img')?.src;
      const rating: string | undefined = product.querySelector('[aria-label*="out of 5 stars"]')?.textContent?.trim();
      const reviews: string | undefined = product.querySelector('.s-link-style .s-underline-text')?.textContent?.trim();


      if (title && image) {
        results.push({ title, image, rating: rating || "N/A", reviews: reviews || "N/A" });
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
