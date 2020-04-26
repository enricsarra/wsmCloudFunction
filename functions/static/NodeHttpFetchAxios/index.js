/*
  Peticions a node per http, fetch i axios
*/


addEventListener('load', inici);

function inici() {
    const resultats = document.querySelector("#resultats");
    const subtitul = document.querySelector("#subtitul");
    const inici = document.querySelector("#inici");
    const btn1 = document.querySelector("#btn1");
    const btn2 = document.querySelector("#btn2");
    const btn3 = document.querySelector("#btn3");
    const btn4 = document.querySelector("#btn4");

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

    btn1.addEventListener("click", async() => {

        subtitul.innerText = `Persones loaded. Petició server: "https.get"`;

        const url = 'nodeHttp';
        const resultats = document.querySelector("#resultats");

        try {
            const responseServer = await fetch(url);

            if (responseServer.status !== 200) throw new Error(responseServer.status);
            let body = await responseServer.text();
            resultats.innerHTML = '';
            resultats.innerHTML = body;
            const divResultats = document.querySelectorAll("div.resultats");
            divResultats.forEach(item => {
                item.classList.add("node-http");
            });

        } catch (error) {
            console.error("Problemes al importar per 'http.get'", error);
        }

    });


    btn2.addEventListener("click", async() => {
        subtitul.innerText = `Persones loaded. Petició server: "fetch"`;
        const url = 'nodeFetch';
        const resultats = document.querySelector("#resultats");

        try {
            const responseServer = await fetch(url);

            if (responseServer.status !== 200) throw new Error(responseServer.status);
            let body = await responseServer.text();
            resultats.innerHTML = '';
            resultats.innerHTML = body;
            const divResultats = document.querySelectorAll("div.resultats");
            divResultats.forEach(item => {
                item.classList.add("node-fetch");
            });

        } catch (error) {
            console.error("Problemas al importar per 'fetch'", error);
        }

    });

    btn3.addEventListener("click", async() => {
        subtitul.innerText = `Persones loaded. Petició server: "axios"`;
        const url = 'nodeAxios';
        const resultats = document.querySelector("#resultats");

        try {
            const responseServer = await fetch(url);

            if (responseServer.status !== 200) throw new Error(responseServer.status);
            let body = await responseServer.text();
            resultats.innerHTML = '';
            resultats.innerHTML = body;
            const divResultats = document.querySelectorAll("div.resultats");
            divResultats.forEach(item => {
                item.classList.add("node-axios");
            });

        } catch (error) {
            console.error("Problemas en Async", error);
        }

    });

    btn4.addEventListener("click", async() => {
        subtitul.innerText = `Series Tv loaded. Petició server: "axios"`;
        const url = 'nodeBatmanSuperman';
        const resultats = document.querySelector("#resultats");

        try {
            const responseServer = await fetch(url);

            if (responseServer.status !== 200) throw new Error(responseServer.status);
            let body = await responseServer.text();
            resultats.innerHTML = '';
            resultats.innerHTML = body;
            const divResultats = document.querySelectorAll("div.resultats");
            divResultats.forEach(item => {
                item.classList.add("node-batman-superman");
            });

        } catch (error) {
            console.error("Problemas en Async", error);
        }

    });
}