/*
  Peticions a node per http, fetch i axios
*/


addEventListener('load', inici);

// crear fulla style particular per el html retornat per els buttons
let fullaStyle = "";
if (fullaStyle) {
    eliminarFullaStyle()
};
crearFullaStyle();
fullaStyle.innerHTML = cssFullaStyle();
document.head.appendChild(fullaStyle);


function inici() {

    const resultats = document.querySelector("#resultats");
    const subtitul = document.querySelector("#subtitul");
    const inici = document.querySelector("#inici");
    const btn1 = document.querySelector("#btn1");
    const btn2 = document.querySelector("#btn2");
    const btn3 = document.querySelector("#btn3");

    // Gestió 'inici'. Eliminar el index de sessionStorage
    inici.addEventListener("click", () => {

        // quan fan click 'inici', eliminem de sessionStorage
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

    btn1.addEventListener("click", async() => {

        subtitul.innerText = `/partial/article.html loaded `;

        const url = 'nodeReadHtml';


        esborraFillsResultats("#resultatsHtml");
        esborraFillsResultats("#resultatsTxt");
        esborraFillsResultats("#resultatsImg");
        document.querySelector("#resultatsTxt").style.padding = null;


        const resultats = document.querySelector("#resultatsHtml");

        try {
            const responseServer = await fetch(url);

            if (responseServer.status !== 200) throw new Error(responseServer.status);
            let body = await responseServer.text();
            resultats.innerHTML = body;

        } catch (error) {
            console.error("Problemas en Async", error);
        }

    });


    btn2.addEventListener("click", async() => {
        subtitul.innerText = `/partial/article.txt loaded `;

        const url = 'nodeReadTexte';

        esborraFillsResultats("#resultatsHtml");
        esborraFillsResultats("#resultatsTxt");
        esborraFillsResultats("#resultatsImg");

        const resultats = document.querySelector("#resultatsTxt");
        // no podem posar el padding al css perque es mostra
        // la div buida amb el seu background-color 

        resultats.style.padding = "2em";

        try {
            const responseServer = await fetch(url);

            if (responseServer.status !== 200) throw new Error(responseServer.status);
            let body = await responseServer.text();
            // console.log('body es : ', body);

            resultats.innerHTML = body;

        } catch (error) {
            console.error("Problemas en Async", error);
        }
    });

    btn3.addEventListener("click", async() => {
        subtitul.innerText = `/partial/prototype.png.`;

        const url = 'nodeReadImg';

        esborraFillsResultats("#resultatsHtml");
        esborraFillsResultats("#resultatsTxt");
        esborraFillsResultats("#resultatsImg");
        document.querySelector("#resultatsTxt").style.padding = null;

        const resultats = document.querySelector("#resultatsImg");

        try {
            const responseServer = await fetch(url);

            if (responseServer.status !== 200) throw new Error(responseServer.status);
            let body = await responseServer.text();
            resultats.innerHTML = body;

        } catch (error) {
            console.error("Problemas en Async", error);
        }

    });
}

function eliminarFullaStyle() {
    const node = document.getElementById('estil-resultats');
    node.parentNode.removeChild(node);
}

function crearFullaStyle() {
    fullaStyle = document.createElement('style');
    fullaStyle.id = "estil-resultats";
}

function cssFullaStyle() {
    let html =
        `   
            #resultatsHtml, #resultatsTxt, #resultatsImg {
                margin: 2% auto;
            }
            
            #resultatsHtml {
                display: flex;
                height: auto;
                flex-direction:column;
                margin: 2% auto;
            } 
            #resultatsHtml header{
                background-color: #09c;
                height: 5em;
                line-height: 5em;
                margin: 0px;
                text-align: center;
            }
            #resultatsHtml footer{
                background-color: #09c;
                height: 5em;
                line-height: 5em;
                text-align: center;
            }
            #resultatsHtml main{
                background-color: rgb(200, 213, 224);
                flex-grow: 1;
                padding: 2em;
            }  
            
            #resultatsTxt {
                background-color: rgb(200, 213, 224);
                
            } 

            #resultatsImg {
                margin: 4% auto;
                display: block;
                max-width: 100%;
                height: auto;
            }
            
        `
    return html
}

function esborraFillsResultats(resultat) {
    // console.log("resultat", resultat);
    let element = document.querySelector(resultat);
    // console.log("element", element);
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}