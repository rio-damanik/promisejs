document.getElementById("searchQuery").addEventListener(
  "input",
  debounce(async function (event) {
    const query = event.target.value;
    const newsContainer = document.getElementById("newsContainer");
    const alertBox = document.getElementById("alert");
    const loadingIndicator = document.getElementById("loading");

    console.log("Input changed. Query:", query);

    if (!query) {
      alertBox.style.display = "none";
      newsContainer.innerHTML = "";
      return;
    }

    loadingIndicator.style.display = "block";
    alertBox.style.display = "none";
    newsContainer.innerHTML = "";

    const apiKey = "13565b3eae304232ba7e66d4499ac7e3";
    const url = `https://newsapi.org/v2/everything?q=${query}&language=id&apiKey=${apiKey}`;

    console.log("Fetching data from API:", url);

    try {
      const response = await fetch(url);
      if (response.status === 426) {
        throw new Error("API key requires an upgrade.");
      }
      const data = await response.json();

      loadingIndicator.style.display = "none";

      if (!data.articles || data.articles.length === 0) {
        alertBox.style.display = "block";
        alertBox.textContent = "Berita tidak ditemukan.";
        console.log("No articles found.");
      } else {
        console.log("Articles found:", data.articles.length);
        data.articles.forEach((article) => {
          const articleHTML = `
            <div class="col-md-4">
              <div class="card mb-4">
                <img src="${article.urlToImage}" class="card-img-top" alt="${article.title}">
                <div class="card-body">
                  <h5 class="card-title">${article.title}</h5>
                  <p class="card-text">${article.description}</p>
                  <a href="${article.url}" class="btn btn-primary" target="_blank">Baca Selengkapnya</a>
                </div>
              </div>
            </div>
          `;
          newsContainer.innerHTML += articleHTML;
          console.log("Article added to the container:", article.title);
        });
      }
    } catch (error) {
      loadingIndicator.style.display = "none";
      alertBox.style.display = "block";
      if (error.message === "API key requires an upgrade.") {
        alertBox.textContent = "API key memerlukan peningkatan versi. Silakan periksa status langganan Anda.";
      } else {
        alertBox.textContent = "Terjadi kesalahan saat mengambil data. Coba lagi nanti.";
        console.log("Error fetching data:", error);
      }
    }
  }, 500)
);

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
