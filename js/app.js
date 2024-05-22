document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const contentContainer = document.querySelector('.horizontal-scroll-container');
    const filmSection = document.querySelector('#film');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = event.target.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);

            console.log(`Navigating to section: ${sectionId}`);

            if (section) {
                // Load content dynamically
                loadContent(sectionId).then(() => {
                    // Custom horizontal scroll
                    horizontalScrollToSection(section);

                    // Update the URL without reloading the page
                    if (sectionId === 'home') {
                        history.pushState(null, '', '/');
                    } else {
                        history.pushState(null, '', `/${sectionId}`);
                    }
                });
            }
        });
    });

    // Handle back/forward navigation
    window.addEventListener('popstate', () => {
        const path = location.pathname.substring(1);
        const sectionId = path === '' ? 'home' : path;
        const section = document.getElementById(sectionId);

        console.log(`Handling popstate for section: ${sectionId}`);

        if (section) {
            loadContent(sectionId).then(() => {
                horizontalScrollToSection(section);
            });
        }
    });

    // Initial load based on URL
    const initialPath = location.pathname.substring(1);
    const initialSectionId = initialPath === '' ? 'home' : initialPath;
    const initialSection = document.getElementById(initialSectionId);

    if (initialSection) {
        console.log(`Initial load for section: ${initialSectionId}`);
        loadContent(initialSectionId).then(() => {
            horizontalScrollToSection(initialSection);
        });
    }
});

async function loadContent(sectionId) {
    try {
        console.log(`Loading content for: ${sectionId}`);
        const response = await fetch(`${sectionId}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load ${sectionId}.html: ${response.statusText}`);
        }
        const data = await response.text();
        document.querySelector(`#${sectionId}`).innerHTML = data;

        console.log(`Content loaded for: ${sectionId}`);

        // Check if the loaded section is either 'film' or 'anim'
        if (sectionId === 'film' || sectionId === 'anim') {
            addFadeOutAnimation(sectionId).then(() => {
                unloadHome().then(() => {
                    loadNewContent(sectionId).then(() => {
                        if (sectionId === 'anim') {
                            // Reinitialize the Vimeo player if the section is anim
                            reinitializeVimeoPlayer();
                        }
                    });
                });
            });
        }

        // Re-attach event listeners if home content is loaded
        if (sectionId === 'home') {
            unloadFilmAndAnim();
            attachNavLinks();
        }

        if (sectionId === 'card') {
            unloadFilmAndAnim();
        }
    } catch (error) {
        console.error('Error loading content:', error);
        alert(`There was an error loading the content. Please try again later.`);
    }
}

function attachNavLinks() {
    const navLinks = document.querySelectorAll('#home a');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = event.target.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);

            console.log(`Attaching link event for section: ${sectionId}`);

            if (section) {
                // Load content dynamically and unload home if necessary
                loadContent(sectionId).then(() => {
                    horizontalScrollToSection(section);

                    // Update the URL without reloading the page
                    if (sectionId === 'home') {
                        history.pushState(null, '', '/');
                    } else {
                        history.pushState(null, '', `/${sectionId}`);
                    }
                });
            }
        });
    });
}

function addFadeOutAnimation(sectionId) {
    return new Promise((resolve) => {
        console.log(`Adding fade-out animation for section: ${sectionId}`);
        const homeSection = document.querySelector('#home');
        const homeContent = homeSection.children;

        for (let element of homeContent) {
            element.classList.add('fade-out');
        }

        setTimeout(() => {
            resolve();
        }, 1000); // Delay for the duration of the fade-out animation
    });
}

function unloadHome() {
    return new Promise((resolve) => {
        console.log(`Unloading home content`);
        const homeSection = document.querySelector('#home');
        homeSection.innerHTML = '';
        resolve();
    });
}

function loadNewContent(sectionId) {
    console.log(`Loading new content for section: ${sectionId}`);
    const homeSection = document.querySelector('#home');
    return fetch(`${sectionId}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${sectionId}.html: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            homeSection.innerHTML = data;
            console.log(`New content loaded for: ${sectionId}`);
        })
        .catch(error => {
            console.error('Error loading new content:', error);
            alert(`There was an error loading the new content. Please try again later.`);
        });
}

function reinitializeVimeoPlayer() {
    console.log('Reinitializing Vimeo player');
    const script = document.createElement('script');
    script.src = "https://player.vimeo.com/api/player.js";
    document.body.appendChild(script);
}

function horizontalScrollToSection(section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
}

function expandCategory(element) {
    console.log("Category clicked:", element);
    const expandedElements = document.querySelectorAll('.expanded');
    expandedElements.forEach(el => {
        el.classList.remove('expanded');
    });
    element.classList.add('expanded');
}

// Unload Film and Anim
function unloadFilmAndAnim() {
    const filmSection = document.getElementById('film');
    const animSection = document.getElementById('anim');
    
    if (filmSection) {
        filmSection.innerHTML = '';
        console.log('Film content unloaded');
    }

    if (animSection) {
        animSection.innerHTML = '';
        console.log('Anim content unloaded');
    }
}
