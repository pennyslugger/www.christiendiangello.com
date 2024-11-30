async function fetchAndParseAll(urls) { //fetching the good stuff
    const promises = urls.map(async url => {
        try {
            const response = await fetch(url);
            const htmlText = await response.text();
            const parser = new DOMParser();
            return parser.parseFromString(htmlText, "text/html"); 
        } catch (error) {
            console.error(`Error fetching or parsing ${url}:`, error);
            return null;
        }
    });

    return Promise.all(promises);
}
async function processFirstChildFromPages(urls) { //retrieving latest blog / video
    const docs = await fetchAndParseAll(urls); 
    const firstItems = []; 

    docs.forEach(doc => {
        if (!doc) return; 
        const galleries = doc.querySelectorAll('.gallery');
        galleries.forEach(gallery => {
            const firstChild = gallery.firstElementChild;
            if (firstChild) {
                firstItems.push({
                    src: firstChild.firstElementChild.getAttribute('src'),
                    alt: firstChild.firstElementChild.getAttribute('alt'),
                    href: firstChild.getAttribute('href'),
                });
            }
        });
    });
const sortedFirst = firstItems.sort((a, b) => {     // Sorting latest by alt tag date
    const dateA = new Date(a.alt);
    const dateB = new Date(b.alt);
    return dateB - dateA;
});
    const latestDate = sortedFirst[0].alt;
    const latestLink = sortedFirst[0].href;
    const latestTitle = sortedFirst[0].src;
    const suf = new RegExp(/\.[^/.]+$/)
      document.getElementById("date").textContent=latestDate;
      document.getElementById('latestLink').href = latestLink;
      document.getElementById('latestTitle').textContent = latestTitle.replaceAll("_"," ").replaceAll("img/","").replace(suf,"");
      document.querySelector('.spotlight').style.backgroundImage = `url('${latestTitle}')`;
      return firstItems;
    }
    (async function () {
        const urls = ['work.html', 'blog.html']; // URLs to fetch
        const firstItems = await processFirstChildFromPages(urls);
})();