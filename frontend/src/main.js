const form = document.getElementById("search-form");
const searchField = document.getElementById("search-field");
const resultsContainer = document.getElementById("results");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // The white spaces at the ends are removed.
  // And, if it is a name with more than one word, the separation between the words will become '+'
  const keyword = searchField.value.trim().replace(" ", "+");
  if (!keyword) return;

  resultsContainer.innerHTML = "<p>Loading...</p>";

  try {
    //  If the user writes any character with special meaning in the URL (such as: '?', '&'...)
    //   the encodeURIComponent ensures that the information can be used without problems 
    //  encodeURIComponent 
    const res = await fetch(`/api/scrape?keyword=${encodeURIComponent(keyword)}`);

    const products = await res.json();

    if (!products.length) {
      resultsContainer.innerHTML = "<p>No products found.</p>";
      return;
    }

    resultsContainer.innerHTML = products.map((product) => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}" />
        <h2 class="product-title">${product.title}</h2>
        <p class="product-rating">${product.rating}</p>
        <span class="product-reviews">${product.reviews} reviews</span>
      </div>
    `).join("");
  } catch (err) {
    console.error(err);
    resultsContainer.innerHTML = "<p>Error searching for products.</p>";
  }
});
