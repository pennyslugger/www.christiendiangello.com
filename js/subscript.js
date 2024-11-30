document.querySelector(".gallery").firstElementChild.classList.add("latestPost");
const suf = new RegExp(/\.[^/.]+$/)
const h1Elements = document.querySelectorAll("h1");

h1Elements.forEach(h1 => {
  // Find the sibling element with an "alt" attribute
  const sibling = h1.previousElementSibling;
  if (sibling && sibling.hasAttribute("src")) {
    const altText = sibling.getAttribute("src");
    h1.textContent = altText.replaceAll("_"," ").replaceAll("img/","").replace(suf,"");
  }
});