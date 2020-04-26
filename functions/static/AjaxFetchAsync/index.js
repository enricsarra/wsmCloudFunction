// Executem tot al client.
// No es fá cap acces a node perque serveixi quelcom

addEventListener('load', inici);

function inici() {

    const url = "http://api.tvmaze.com/search/shows?q=batman";
    const urlSuperman = "http://api.tvmaze.com/search/shows?q=superman";
    const urlGirls = "http://api.tvmaze.com/search/shows?q=girls";
    const url404 = "https://jsonplaceholder.typicode.com/otroendpoint";
    const resultats = document.querySelector("#resultats");
    const subtitul = document.querySelector("#subtitul");
    const inici = document.querySelector("#inici");
    const btn1 = document.querySelector("#btn1");
    const btn2 = document.querySelector("#btn2");
    const btn3 = document.querySelector("#btn3");

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

    //Exemple 1 - utilitzant callbacks
    btn1.addEventListener("click", () => {
        subtitul.innerText = "Callbacks loading";

        const ajax = new XMLHttpRequest();
        ajax.open("GET", url);
        ajax.addEventListener("load", (e) => {
            if (e.target.status !== 200) {
                console.log("Error!", e.target.status);
                return;
            }

            montarLlistat(JSON.parse(ajax.responseText).slice(0, 3), resultats);
            subtitul.innerText = "Callbacks loaded";

        });
        ajax.send();
    });

    //Exemple 2 - utilitzant promeses
    btn2.addEventListener("click", () => {
        subtitul.innerText = "Promeses loading";


        fetch(urlSuperman)
            .then(response => {
                if (response.status !== 200) throw new Error(response.status);
                return response.json()
            })
            .then(llistat => {
                montarLlistat(llistat.slice(0, 3), resultats);
                subtitul.innerText = "Promeses loaded";
            }).catch(error => {
                console.error("Error en promeses", error);
            })
    });

    //Exemple 3  - utilitzant async / await
    btn3.addEventListener("click", async() => {
        subtitul.innerText = "Async/Await loading";

        try {
            //recordar declarar el callback amb async
            const respuesta = await fetch(urlGirls);
            if (respuesta.status !== 200) throw new Error(respuesta.status);
            const llistat = await respuesta.json();
            montarLlistat(llistat.slice(0, 3), resultats);
            subtitul.innerText = "Async/Await loaded";
        } catch (error) {
            console.error("Problemas en Async", error);
        }

    });
}


///////////////////////// Helpers ///////////////////////////

/*
 * montarLlistat
 * Montar el DOM a resultat.
 * Aprofitem per probrar que funciona la importació de MyFrameworkClient.js
 */

function montarLlistat(llistat, container) {
    //--------
    //  MyFrameworkClient.js no funciona al Safari
    /* const templater = MyFramework.Utils.Templates.templater;
    const imgTemplate = templater `<figure>
    <img alt="${ 'name' }" src="${ 'src' }">
    <figcaption>${ 'caption' }</figcaption>
</figure>`;

    const img1 = {
        name: 'Hidetaka Miyazaki',
        src: 'Hidetaka_miyazaki.jpg',
        caption: 'Japanese God'
    };
    const myTemplate = imgTemplate(img1);
    console.info(myTemplate);
 */
    //--------


    container.innerText = "";
    llistat.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
      <h3><a href="${item.show.url}">${item.show.name}</a></h3>
      <img src="${item.show.image.original}" style="width:50%"/>
      <div>${item.show.summary}</div>
    `;
        container.appendChild(div);
    });
}