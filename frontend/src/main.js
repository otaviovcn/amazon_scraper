import './style.css'

document.querySelector('#app').innerHTML = `
    <header class="header" role="banner">
      <h1 id="logo">Amazon Scrapper</h1>
      <form id="search-form" role="search">
        <input type="text" id="search-field" name="search-field" placeholder="Enter the desired product" required>
        <button type="submit" id="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-search">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </form>
    </header>

  <main id="results" class="results"></main>

`