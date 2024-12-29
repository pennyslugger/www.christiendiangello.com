const liveElements = document.querySelectorAll('[data-content="Live"]');
const animElements = document.querySelectorAll('[data-content="Anim"]');

function showAnim() {
    // Loop through the elements and add the 'hide' class
    liveElements.forEach(element => {
        element.classList.add('hide');
    });
    animElements.forEach(element => {
        element.classList.remove('hide');
    })
}

function showLive() {
    // Loop through the elements and add the 'hide' class
    animElements.forEach(element => {
        element.classList.add('hide');
    });
    liveElements.forEach(element => {
        element.classList.remove('hide');
    })
}

function showAll() {
    // Loop through the elements and add the 'hide' class
    animElements.forEach(element => {
        element.classList.remove('hide');
    });
    liveElements.forEach(element => {
        element.classList.remove('hide');
    })
}

function selectOption(button) {
    const buttons = document.querySelectorAll('button[name="filters"]');
        buttons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');

    console.log(`Selected filter`);
}
