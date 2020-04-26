// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// es el wsm del raspberry posata a una cloud function firebase

const functions = require('firebase-functions');

const terminator = require('./MyFramework').terminator;
// const server = require("./server");
const route = require("./router").route;

const requestHandlers = require("./requestHandlers");

// Montem objecte handle. Queda pendent importar 'handle' i no 
// definil aquí... Pot ser que no valqui la pena perque el proxim wsm
// será amb 'express' i aquest wsm es un node a 'pel'.
const handle = {}
handle['/'] = requestHandlers.staticPages;
handle['/static'] = requestHandlers.staticPages;
handle['/partial'] = requestHandlers.partialPages;

handle['/nodeReadHtml'] = requestHandlers.nodeReadHtml;
handle['/nodeReadTexte'] = requestHandlers.nodeReadTexte;
handle['/nodeReadImg'] = requestHandlers.nodeReadImg;

handle['/nodeHttp'] = requestHandlers.nodeHttp;
handle['/nodeFetch'] = requestHandlers.nodeFetch;
handle['/nodeAxios'] = requestHandlers.nodeAxios;
handle['/nodeBatmanSuperman'] = requestHandlers.nodeBatmanSuperman;

handle['/formulari1'] = requestHandlers.formulari1;
handle['/uploadformulari1'] = requestHandlers.uploadformulari1;
handle['/llistardirectori'] = requestHandlers.llistardirectori;



// accions a fer si es cancela el process.
// terminator();

const http = require("http");
const url = require("url");
const path = require('path');

//
exports.wsmCloudFunction = functions.https.onRequest((request, response) => {

    let postData = "";
    let pathname = url.parse(request.url, true).pathname;
    let query = url.parse(request.url, true).query;
    const { url: _url, method, headers } = request;
    const _extname = path.extname(request.url);
    const _dirname = path.dirname(request.url);
    const _basename = path.basename(request.url);

    // console.log(` *** Peticio per ${ pathname } rebuda. *** `);

    /* console.info('query-query::', url.parse(request.url, true).query); */

    /* console.log(`
    parametres ${ method } : ${ JSON.stringify(query) } // de objecte a string
    method : ${ method }
    _url : ${_url}
    url.parse(request.url : ${url.parse(request.url, true)}
    propietats url. . . . . . . . . . . . . : ${Object.keys(url)}
    propietats url.parse(request.url, true) : ${Object.keys(url.parse(request.url, true))}
    pathname : ${pathname}
    _extname : ${_extname}
    _dirname : ${_dirname}
    _basename: ${_basename}
    userAgent : ${ headers['user-agent'] }
    __dirname : ${__dirname}
    __filename: ${__filename}
    `); */

    // console.log(`*** Propietats request : ${Object.keys(request)} ***`);

    /* Object.keys(url.parse(request.url)).forEach((element, index, array) => { console.log(`aaaaaaaa ${element} : ${Object.values(url.parse(request.url))[index]}`) }); */

    /* let arrayEnric = [];
    Object.keys(url.parse(request.url)).forEach((element, index, array) => { arrayEnric[index] = `${element} :  ${ Object.values(url.parse(request.url))[index]}` });
    console.log(arrayEnric); */



    request.setEncoding('utf8'); // esperem la informacio rebuda amb utf-8
    console.log('req.method............', request.method);

    //Afegim els trossos d'informacio que van arribant d'una petició post 
    request.on('data', (postDataChunk) => {
        postData += postDataChunk;
        console.log(`*** Rebut un tross POST: ${ postDataChunk } que anem afegint a postData. ***`);
    });

    /* console.log(`*** Rebut postData POSTqqqqqqqqqqq: ${ request.body.text }`); */
    // Quan ha arribat tota l'informacio cridem al router

    request.on('end', () => {
        console.log(`*** Rebut postData POST: ${ postData}`);
        //  li passem al route la responsabilitat i alliberem al server 
        route(handle, pathname, response, postData, _extname);
    });


});