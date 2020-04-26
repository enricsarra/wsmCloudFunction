// Arranquem servidor

const myVersio = "v 2.1.o";

const http = require("http");
const url = require("url");
const path = require('path');
// const querystring = require('querystring');
let MyDate = require('./MyFramework').MyDate;
const port = require('./MyFramework').varEnvProcess.PORT;



// funcio - engegar server
function startServer(route, handle) {

    function onRequest(request, response) {
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


        //Afegim els trossos d'informacio que van arribant d'una petició post 
        request.on("data", function(postDataChunk) {
            postData += postDataChunk;
            // console.log(`*** Rebut un tross POST: ${ postDataChunk } que anem afegint a postData. ***`);
        });

        // Quan ha arribat tota l'informacio cridem al router
        request.on("end", function() {
            // console.log(`*** Rebut postData POST: ${ postData }`);
            //  li passem al route la responsabilitat i alliberem al server 
            route(handle, pathname, response, postData, _extname);
        });

    };


    http.createServer(onRequest).listen(port, function() {
        console.log(`[${(new MyDate).yyyymmdd()} ${(new MyDate).hhmmss()}] WSM server [ ${myVersio} ] escoltant al port [${port}].El pid del process es ${ process.pid }`);
    });


    //    http.createServer(onRequest).listen(1144, function() { console.log("Server has started port 1144"); });

};

exports.startServer = startServer;