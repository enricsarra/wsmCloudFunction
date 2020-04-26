let index,
    indexSessionStorage,
    colors = ['#429997', '#dd926c', '#816c96', '#898442'];

index = getIndex();
// console.log('index: ', index);

// Recuperem les ilustracions i descripcions
// NodeList.forEach
// querySelectorAll returns a static non-live NodeList exposing a forEach method:
let ilustracionsDescripcions = document.querySelectorAll('.picture-container, .description-container');
addDisplayed();



document.querySelectorAll('.nav-control').forEach(element => {
    element.addEventListener("click", () => {
        //gestió contador index
        if (element.classList.contains('next') && index < document.getElementsByClassName('picture-container').length) { index++ }
        if (element.classList.contains('prev') && index > 1) { index-- }

        sessionStorage.setItem('indexSessionStorage', index);

        delDisplayed();
        addDisplayed();

    })

});

// gestio index
function getIndex() {
    // enllaç per treballar amb SessionStorage
    // https://ed.team/blog/que-es-y-como-utilizar-localstorage-y-sessionstorage
    indexSessionStorage = sessionStorage.getItem('indexSessionStorage');
    if (indexSessionStorage === null) {
        index = 1;
        sessionStorage.setItem('indexSessionStorage', '1');
    } else {
        index = parseInt(sessionStorage.getItem('indexSessionStorage'))
    }
    return index
}

// afegim las class 'displayed' al index que toca.
function addDisplayed() {
    document.querySelector('.picture-' + index).classList.add('displayed');
    document.querySelector('.description-' + index).classList.add('displayed');
    document.querySelector('.character-description').style.backgroundColor = colors[index - 1];
}

// eliminem totes les class  'displayed' de les il.lustracions i descripcions
function delDisplayed() {
    ilustracionsDescripcions.forEach(element => {
        element.classList.remove('displayed');
    });
}


// he sustituit el jquery per javascript
/* $
('.nav-control').on('click', function() {

    if ($(this).hasClass('next') && index < $('.picture-container').length) {
        index++;
    }
    if ($(this).hasClass('prev') && index > 1) {
        index--;
    }
    $('.picture-container, .description-container').removeClass('displayed');
    $('.picture-' + index + '').addClass('displayed');
    $('.description-' + index + '').addClass('displayed');
    $('.character-description').css('background-color', colors[index - 1]);

}); */