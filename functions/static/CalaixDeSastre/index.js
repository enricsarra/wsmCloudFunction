/*
  Visualitzem un formulari
  Llistem el directori del wsm
*/


addEventListener('load', inici);

function inici() {

    const resultats = document.querySelector("#resultats");
    const subtitul = document.querySelector("#subtitul");
    const inici = document.querySelector("#inici");
    const btn1 = document.querySelector("#btn1");
    const btn2 = document.querySelector("#btn2");

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

        subtitul.innerText = `Visualitzem un formulari. Teclejem el texte i node ens retorna el que em teclejat`;

        const url = 'formulari1';
        const urlSubmit = 'uploadformulari1';
        const resultats = document.querySelector("#resultats");
        const resultatPost = document.querySelector("#resultatPost");

        try {
            const responseServer = await fetch(url);

            if (responseServer.status !== 200) throw new Error(responseServer.status);
            let body = await responseServer.text();
            resultats.innerHTML = body;

            // preparem acció per quan fem el 'submit'

            const formulari = document.getElementsByTagName('form');
            const inputEnviar = formulari[0].querySelector('[type]');
            inputEnviar.addEventListener('click', async() => {
                try {
                    // simulem como ho faría un submit amb les dades del post
                    const data = new URLSearchParams();
                    const valueText = formulari[0].querySelector('[name = text]').value;
                    const valueText1 = formulari[0].querySelector('[name = text1]').value;
                    data.append('text', valueText);
                    data.append('text1', valueText1);
                    const responseSubmit = await fetch(urlSubmit, {
                        method: 'POST',
                        body: data
                    });

                    if (responseSubmit.status !== 200) throw new Error(responseSubmit.status);
                    let body = await responseSubmit.text();
                    const respostaPost = document.getElementById('respostaPost');
                    // console.log('respostaPost : ', respostaPost);
                    resultatPost.innerHTML = body;

                } catch (error) {
                    console.error("Problemas en Async", error);
                }
            })

        } catch (error) {
            console.error("Problemas en Async", error);
        }

    });


    btn2.addEventListener("click", async() => {
        subtitul.innerText = `Llistem el directori del wsm`;

        const url = 'llistardirectori';
        const resultats = document.querySelector("#resultats");

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

}