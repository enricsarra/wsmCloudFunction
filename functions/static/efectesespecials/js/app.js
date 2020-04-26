jQuery(document).ready(function($) {

    $('#menu-handler').on('click', function() {


        $(this).fadeOut(300, function() {
            $(this).toggleClass('icon-close').fadeIn(300);
        });

        $('nav').toggleClass('displayed');
    });

    $('.sub-menu-parent').on('click', function() {

        $('.sub-menu').toggleClass('displayed-submenu');
    });


});

addEventListener('load', inici);

function inici() {


    const inici = document.querySelector("#inici");

    // Gestió 'inici'. Eliminar el index de sessionStorage
    inici.addEventListener("click", () => {

        // quan fan click a 'inici', eliminem de sessionStorage
        // per anar a la pagina principal

        let indexSessionStorage = sessionStorage.getItem('indexSessionStorage');
        if (!!indexSessionStorage) {
            sessionStorage.removeItem(sessionStorage.removeItem('indexSessionStorage'));
        }
        // important: per fer console.log aquí s´ha de convertir a comentari la 
        // línia 'location.assign("/static/index/index.html");'
        // sino no funciona. Encara no sé per qué.
        // console.log('indexSessionStorage', indexSessionStorage);

        location.assign("/static/index/index.html");
    });
}