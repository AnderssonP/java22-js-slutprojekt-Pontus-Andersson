const API_KEY = "a7657942b058415075d0540b9636f82e";
// hämtar DOM-element
const form = document.getElementById("search-form");
const text = document.getElementById("search-text");
const count = document.getElementById("image-count");
const size = document.getElementById("image-size");
const resultEl = document.getElementById("results");
const sort = document.getElementById("sort-order");
// skapar bild
const createImage = (photo, size) => {
  const a = document.createElement("a");
  a.href = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
  a.target = "_blank";
  const img = document.createElement("img");
  img.src = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`;
  a.appendChild(img);
  resultEl.append(a);
};
// Får knappen att fungera och utföra sökning
form.addEventListener("submit", event => {
  event.preventDefault();
  resultEl.innerHTML = "";

  const textValue = text.value;
  const countValue = count.value;
  const sizeValue = size.value;
  const sortValue = sort.value;
// sorterar på vilka bilder som ska hittas
  let sortOpt = "";
  switch (sortValue) {
    case "date":
      sortOpt = "date-posted-desc";
      break;
    case "relevance":
      sortOpt = "relevance";
      break;
    case "interestingness":
      sortOpt = "interestingness-desc";
      break;
  }
// hämtar url och gör om till JSON format
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&text=${textValue}&per_page=${countValue}&sort=${sortOpt}&format=json&nojsoncallback=1`;
  fetch(url)
    .then(response => response.json()).then(data => {
        // Kollar så alla fält är ifyllda
      if (!textValue || !countValue) {
        resultEl.innerHTML = "Fyll i alla fält!";
        return;
      }
    //   hämtar storlekar på bilderna
      data.photos.photo.forEach(photo => {
        switch (sizeValue) {
          case "small":
            createImage(photo, "w");
            break;
          case "medium":
            createImage(photo, "c");
            break;
          case "large":
            createImage(photo, "b");
            break;
        }
      });
// Om inga bilder hittas så kommer felmeddelande upp.
      if (!data.photos.photo.length) {
        resultEl.innerHTML = "Inga bilder hittades.";
      }
    })
    // Om det är något fel med server kommer error meddelande upp på sidan.
    .catch(error => {
      resultEl.innerHTML = "Ett fel inträffade, försök igen senare.";
      console.log(error);
    });
});



