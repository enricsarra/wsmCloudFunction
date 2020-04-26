// Modul requestHandlers

const querystring = require("querystring");
const fs = require('fs');
let exec = require("child_process").exec;
const templater = require('./MyFramework').templater;
const http = require("http"); //API nativa
const https = require("https"); //Atención, https se implementa en otro modulo nativo
const fetch = require("node-fetch"); // 
const axios = require("axios"); // Axios. Utilitza promises y funciona tanto en web 
// conversió a JSON automatica y control de errors de status HTTP
const MyArray = require('./MyFramework').MyArray;


// Funcions privades


const mime = {
    'html': 'text/html',
    'txt': 'text/plain',
    'text': 'text/plain',
    'js': 'text/javascript',
    'css': 'text/css',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpg',
    'gif': 'image/gif',
    'wav': 'audio/wav',
    'mp4': 'video/mp4',
    'woff': 'application/font-woff',
    'ttf': 'application/font-ttf',
    'eot': 'application/vnd.ms-fontobject',
    'otf': 'application/font-otf',
    'svg': 'application/image/svg+xml'
};

// llegir montar html per imatges
const getImg = (name) => {
    const imgTemplate = templater `<figure>
    <img class="card" alt="${ 'name' }" src="${ 'src' }">
    <figcaption>${ 'caption' }</figcaption>
</figure>`;
    const img = {
        name: name,
        src: `static/NodeReadFiles/img/${name}`,
        alt: 'El cor del javascript',
        caption: 'Les entranyes del javascript'
    };
    const myTemplate = imgTemplate(img);
    return myTemplate
}

// llegir fitxer com una promise
const getFile = (name) => {

    return new Promise((resolve, reject) => {
        fs.readFile(name, (err, data) => {

            // fs.readFile(name, 'utf-8', (err, data) => {
            if (err) {
                reject("Error reading", name);
            } else {

                let arrayName = name.split('.');
                let extName = arrayName[arrayName.length - 1];
                switch (extName.toLowerCase()) {
                    case 'html':
                        resolve(data);
                        break;
                    case 'json':
                        resolve(JSON.parse(data));
                        break;
                    case 'text':
                        resolve(data);
                        break;
                    case 'txt':
                        resolve(data);
                        break;
                    case 'css':
                        resolve(data);
                        break;
                    case 'js':
                        resolve(data);
                        break;
                }

            }
        });
    });

}

// construir html dels usuaris retornats.
// utilitzo el meu 'templater' 
const montarHtmlUsers = (contentFile) => {

    // obtenim un array amb un subconjunt de les propietats de contentFile
    const subContentFile = contentFile.map((element, index, array) => {
        return {
            ['id']: element.id,
            ['name']: element.name,
            ['username']: element.username,
            ['email']: element.email,
            ['street']: element.address.street,
            ['suite']: element.address.suite,
            ['city']: element.address.city,
            ['phone']: element.phone
        }
    });

    // definim la template
    const userTemplate = templater `<div class="resultats"> <p> <span> id : ${'id'}</span></p>
    <p> <span> name : ${'name'}</span></p>
    <p> <span> username : ${'username'}</span></p>
    <p> <span> email : ${'email'}</span></p>
    <p> <span> address : ${'street'} - ${'suite'} - ${'city'}</span></p>
    <p> <span> phone : ${'phone'}</span></p>
    </div>
`;
    // per cada usuari construim la template i retornem el html montat
    let myTemplateUsers = subContentFile.map(user => userTemplate(user)).join('\n');
    return myTemplateUsers
}

// construir html dels usuaris retornats.
// utilitzo el meu 'templater' 
const montarHtmlBatmanSuperman = (contentFile) => {

    // obtenim un array amb un subconjunt de les propietats de contentFile

    const subContentFile = contentFile.map((element, index, array) => {
        const objRetornar = {
            ['id']: element.show.id,
            ['name']: element.show.name,
            ['score']: element.score,
            ['url']: element.show.url,
            ['premiered']: element.show.premiered
        }
        if (element.show.image === null) {
            objRetornar['image'] = null
        } else {
            objRetornar['image'] = element.show.image.medium
        }

        return objRetornar
    });

    // definim la template
    const userTemplate = templater `<div class="resultats"> <p> <span> id : ${'id'}</span></p>
    <p> <span> name : ${'name'}</span></p>
    <p> <span> score : ${'score'}</span></p>
    <p> <span> url : ${'url'}</span></p>
    <p> <span> image : <a href=${'image' }>Enllaç a la imatge</a></span></p>
    <p> <span> premiered : ${'premiered'}</span></p>
    </div>
`;

    // per cada usuari construim la template i retornem el html montat
    let myTemplateUsers = subContentFile.map(user => userTemplate(user)).join('\n');
    return myTemplateUsers
}

// accedim a una url per el módul 'http' 
const getPerHttp = (url) => {

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const { statusCode } = res;

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { //Event recepció de datdes
                rawData += chunk;
            });

            res.on('end', () => { //Event fi de dades
                try {
                    // resolve(rawData);
                    resolve(JSON.parse(rawData)); // retornem objecte d'usuaris
                } catch (e) {
                    reject(e.message);
                }
            });
        }).on('error', (e) => {
            reject(`Error!: ${e.message}`);
        });
    });

}

// accedim a una url per el módul 'node-fetch' 
const getPerFetch = async(url) => {
    try {
        const resultat = await fetch(url);
        return resultat.json();
    } catch (err) {
        console.log("Error! Catch getPerFetch", err)
        new Error('Error! Catch getPerFetch' + err)
    }
}

// accedim a una url per el módul 'axios' 
const getPerAxios = async(url) => {
    try {
        const resultat = await axios.get(url);
        return resultat.data
    } catch (err) {
        new Error('Error! Catch getPerAxios' + err.response.status)
    }
}

// salvem a un fitxer 
const saveFile = (name, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(name, data, 'utf-8', (err) => {
            if (err)
            //reject("Error saving", name);
                reject("Error saving  " + name + "  " + err);
            else
            //resolve("Done! saving", name);
                resolve("Done! saving  " + name);
        });
    });
}



//************************************************************************ 
// Funcions  públiques
//************************************************************************ 

function staticPages(response, pathname, postData, _extname) {
    // console.log(` Manipulador de la peticio 'staticPages'  : ${ pathname } ha estat cridat. `);
    let rutaPerStaticPages = "";
    let arrayRuta = [];
    if (pathname == "/") {
        rutaPerStaticPages = "static/index/index.html"
    } else {
        arrayRuta = pathname.split("/"); // "/static/index.html"  ----->  ["", "static", "index.html"]
        arrayRuta.shift(); // ["", "static", "index.html"] -----> ["static", "index.html"]
        rutaPerStaticPages = arrayRuta.join('/'); // ["static", "index.html"]  ----> "static/index.html"
    }

    // Serveix per quan la html, carregui el css i javascript.
    // de moment....
    let contentType = '';
    switch (_extname) {
        case '.html':
            contentType = 'text/html';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
    }

    fs.stat(rutaPerStaticPages, (error, stats) => {
        if (!error) {
            fs.readFile(rutaPerStaticPages, (error, contingut) => {
                if (error) {
                    response.writeHead(500, { 'Content-Type': 'text/html; charset=UTF-8' });
                    response.write('<h1> Error intern </h1>');
                    response.end();
                } else {
                    //response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
                    response.writeHead(200, { 'Content-Type': `${contentType} ; charset=UTF-8` });
                    response.write(contingut);
                    response.end();
                }
            });
        } else {
            response.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
            response.write(`<!doctype html><html><head></head><body> Recurs ${rutaPerStaticPages} inexistent</body></html>`);
            response.end();
        }
    });

}

// ************************************************************
// Al final crec que desapareixerá
// **********************************************************
function partialPages(response, pathname, postData, _extname) {

    // console.log(` Manipulador de la peticio 'partialPages'  : ${ pathname } ha estat cridat. `);
    let rutaPerPartialPages = "";
    let arrayRuta = [];
    let fitxerLlegir = '';

    if (pathname == "/partial") {

    } else {
        arrayRuta = pathname.split("/");
    }
}


// ************************************************************
// nodeReadHtml: Llegim un html del directori partial
// **********************************************************
function nodeReadHtml(response, pathname, postData, _extname) {

    // console.log(` Manipulador de la peticio '/nodeReadHtml'  : ${ pathname } ha estat cridat. `);

    (async(fitxerHtmlLlegir) => {
        try {

            const contentFile = await getFile(fitxerHtmlLlegir);
            response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            response.write(contentFile);
            response.end();

        } catch (error) {
            console.log("//////////////////// APP PROBLEMS", error);
            response.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
            response.write(`<p>Error ${contentFile} inexistent</p>`);
            response.end();
        }
    })('partial/article.html');

}


// ************************************************************
// nodeReadTexte: Llegim un arxiu del directori partial
// **********************************************************
function nodeReadTexte(response, pathname, postData, _extname) {

    // console.log(` Manipulador de la peticio '/nodeReadTexte'  : ${ pathname } ha estat cridat. `);

    (async(fitxerTexteLlegir) => {
        try {
            const contentFile = await getFile(fitxerTexteLlegir);
            response.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
            response.write(contentFile);
            response.end();

        } catch (error) {
            console.log("//////////////////// APP PROBLEMS", error);
            response.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
            response.write(`<p>Error ${contentFile} inexistent</p>`);
            response.end();
        }
    })('partial/article.txt');

}

// ************************************************************
// nodeReadImg: Llegim una imatge del directori NodeReadFiles.
//              La imatge té que estar al directori /static...
//              Perque sino quan el <src> de la imatge la vulgui
//              carregar la trobi.
// **********************************************************
function nodeReadImg(response, pathname, postData, _extname) {

    // console.log(` Manipulador de la peticio '/nodeReadImg'  : ${ pathname } ha estat cridat. `);

    (async(imatgeLlegir) => {
        try {
            let vec = imatgeLlegir.split('.'); // vec = [ 'prototype', 'png' ]
            // console.log(vec);

            let extName = vec[vec.length - 1]; // extName = prototype.png
            let contentType = mime[extName];

            response.writeHead(200, { 'Content-Type': `${contentType} ; charset=UTF-8` });
            response.write(getImg(imatgeLlegir)); // montem html de la imatge
            response.end();


        } catch (error) {
            console.log("//////////////////// APP PROBLEMS", error);
            response.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
            response.write(`<p>Error ${contentFile} inexistent</p>`);
            response.end();
        }
    })('prototype.png');

}

// ************************************************************
// nodeHttp: Llegim una url de usuaris amb el modul http
// **********************************************************
function nodeHttp(response, pathname, postData, _extname) {

    // console.log(` Manipulador de la peticio '/nodeHttp'  : ${ pathname } ha estat cridat. `);

    (async(url) => {
        try {
            const contentFile = await getPerHttp(url);
            response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            response.write(montarHtmlUsers(contentFile));
            response.end();

        } catch (error) {
            console.log("//////////////////// APP PROBLEMS", error);
            response.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
            response.write(`<p>Error ${contentFile} inexistent</p>`);
            response.end();
        }
    })('https://jsonplaceholder.typicode.com/users')

}

// ************************************************************
// nodeFetch: Llegim una url de usuaris amb el modul node-fetch
// **********************************************************
function nodeFetch(response, pathname, postData, _extname) {

    // console.log(` Manipulador de la peticio '/nodeFetch'  : ${ pathname } ha estat cridat. `);

    (async(url) => {
        try {
            const contentFile = await getPerFetch(url);
            response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            response.write(montarHtmlUsers(contentFile));
            response.end();

        } catch (error) {
            console.log("//////////////////// APP PROBLEMS", error);
            response.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
            response.write(`<p>Error ${contentFile} inexistent</p>`);
            response.end();
        }
    })('https://jsonplaceholder.typicode.com/users')

}

// ************************************************************
// nodeAxios: Llegim una url de usuaris amb el modul axios
// **********************************************************
function nodeAxios(response, pathname, postData, _extname) {

    // console.log(` Manipulador de la peticio '/nodeAxios'  : ${ pathname } ha estat cridat. `);

    (async(url) => {
        try {
            const contentFile = await getPerAxios(url);
            response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            response.write(montarHtmlUsers(contentFile));
            response.end();

        } catch (error) {
            console.log("//////////////////// APP PROBLEMS", error);
            response.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
            response.write(`<p>Error ${contentFile} inexistent</p>`);
            response.end();
        }
    })('https://jsonplaceholder.typicode.com/users')

}

// ************************************************************
// nodeBatmanSuperman: 
// **********************************************************
/*
  Ejemple  integrador de asincronisme en NodeJS
  1) Obtindre les dades de les series de Batman utilitzant la API de TVMaze 
  2) Obtindre les dades de les series de Superman utilitzant la API de TVMaze
  3) Guardar les dades al arxiu "series.batman.json"
     Aquesta part es extra. Solament la faig per tindre un exemple salvar a arxiu.   
  4) Guardar les dades al arxiu "series.superman.json"
     Aquesta part es extra. Solament la faig per tindre un exemple salvar a arxiu.  
  5) Quan finalitzen els processos, llegir les dades i classificar cronologicament
  6) Monta el html i el envía al client
*/

function nodeBatmanSuperman(response, pathname, postData, _extname) {

    // console.log(` Manipulador de la peticio '/nodeBatmanSuperman'  : ${ pathname } ha estat cridat. `);

    const sortData = (data) => {
        return data.sort((a, b) => {
            return new Date(a.show.premiered) - new Date(b.show.premiered);
        })
    }


    ////////////////////////// App! Recordar, quan utilitzo await tinc que retornar una promesa
    const tvMaze = "http://api.tvmaze.com/search/shows?q=";

    (async() => {
        try {
            const arrayBatmanData = await getPerAxios(`${tvMaze}batman`);
            // console.log("OK Batman TVMaze");
            const arraySupermanData = await getPerAxios(`${tvMaze}superman`);
            // console.log("OK Superman TVMaze");

            // guardem els fitxers com a exercici perque no ho necessitem
            // per contestar al client
            await saveFile("./static/NodeHttpFetchAxios/seriesBatman.json", JSON.stringify(arrayBatmanData));
            await saveFile("./static/NodeHttpFetchAxios/seriesSuperman.json", JSON.stringify(arraySupermanData));
            // console.log("OK Guardar arxius");

            //  concatenem batmanData i supermanData    
            const sortedData = sortData(arrayBatmanData.concat(arraySupermanData));
            response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            response.write(montarHtmlBatmanSuperman(sortedData));
            response.end();

        } catch (error) {
            console.log("//////////////////// APP PROBLEMS", error);
            response.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
            //response.write(`<p>Error ${sortedData} inexistent</p>`);
            response.end();
        }
    })();

}



// **************************************************************
// formulari1: visualitzem el formulari-1 per teclejar molt texte
// i aixì poder veure els 'chunks' del 'post' a 'server.js'
// **************************************************************
function formulari1(response, pathname, postData) {

    // console.log(` Manipulador de la peticio 'formulari1  : ${ pathname } a estat cridat. `);

    let body = `
        <h3> Fem molt espai pel texte per provar els 'chunks' del 'post </h3>
        <form id='formulari1'  action="" method="post" onsubmit = "return false" >
        <textarea name="text" rows="20" cols="30"></textarea>
        <textarea name="text1" rows="20" cols="30"></textarea>
        <input type="submit" value="Enviar texte" />
        </form>
        <h3> Aquí es veurás el que has teclejat al formulari </h3>
    <div id="elquehasescrit"></div>`;

    response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    response.write(body);
    response.end();
}

// **************************************************************
// uploadformulari1: visualitzem el que em teclejat al formulari
// **************************************************************
function uploadformulari1(response, pathname, postData) {
    // console.log(` Manipulador de la peticio 'uploadformulari1  : ${ pathname } a estat cridat. `);
    console.log(` El valor de 'postData' de uploadformulari1 es ${postData}. `);
    let body = `
        <h4> Has enviat: ${ querystring.parse(postData).text } </h4>
    <h4> Has enviat: ${ querystring.parse(postData).text1 } </h4>`;

    response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    response.write(body);
    response.end();

}

// **************************************************************

function llistardirectori(response) {
    // console.log("Manipulador de petición 'upload' ha sido llamado.");

    exec("ls -F", function(error, stdout, stderr) {

        let nouStdout = stdout.replace(/\s/gi, ' <br> '); // sustituim blanc amb <br>

        let body = `
        
        <h2> Llistat del directori ${__dirname} </h2>
        <p> ${nouStdout} </p>
        </body>`;

        response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        response.write(`${ body }`);
        response.end();
    });
}

exports.staticPages = staticPages;
exports.partialPages = partialPages;

exports.nodeReadHtml = nodeReadHtml;
exports.nodeReadTexte = nodeReadTexte;
exports.nodeReadImg = nodeReadImg;

exports.nodeHttp = nodeHttp;
exports.nodeFetch = nodeFetch;
exports.nodeAxios = nodeAxios;
exports.nodeBatmanSuperman = nodeBatmanSuperman;

exports.formulari1 = formulari1;
exports.uploadformulari1 = uploadformulari1;
exports.llistardirectori = llistardirectori;