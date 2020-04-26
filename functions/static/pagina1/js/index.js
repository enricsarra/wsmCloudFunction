/*
  Executem tot al client.
  No es fá cap acces a node perque serveixi quelcom
*/

addEventListener('load', inici);

function inici() {

    const inici = document.querySelector("#inici");

    inici.addEventListener("click", () => {

        // quan fan click a 'inici', eliminem de sessionStorage
        // per anar a la pagina principal

        let indexSessionStorage = sessionStorage.getItem('indexSessionStorage');
        if (!!indexSessionStorage) {
            let abans = sessionStorage.getItem('indexSessionStorage');
            console.log('abans: ', abans);
            sessionStorage.removeItem(sessionStorage.removeItem(indexSessionStorage));
            let despres = sessionStorage.getItem('indexSessionStorage');
            console.log('despres: ', despres);
        }

        // important: per fer console.log aquí s´ha de convertir a comentari la 
        // línia 'location.assign("/static/index/index.html");'
        // sino no funciona. Encara no sé per qué.
        location.assign("/static/index/index.html");
    });
}

jQuery(document).ready(function($) {

    $('#menu-handler').on('click', function() {

        $(this).fadeOut(300, function() {
            $(this).toggleClass('icon-close').fadeIn(300);
        });

        $('nav').toggleClass('displayed');
    });

});