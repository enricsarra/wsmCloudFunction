// Definim el router

function route(handle, pathname, response, postData, _extname) {
    // console.log(`*** A punt de rutejar una peticio per: ${ pathname }. ***`);

    // detectem si el pathname comence per /static o partials
    let rutaPerHandle = pathname;


    // Posem el switch per si es complica en un futur el tractament /// del pathname.

    switch (pathname.split("/")[1]) {
        case 'static':
            // console.log('soc static')
            rutaPerHandle = "/static";
            break;

        case 'partial':
            // console.log('soc partial')
            rutaPerHandle = "/partial";
            break;

        default:
            // es respecta el pathname original
    }
    // console.log('pathname ++++++++', pathname);
    // console.log('ruta per handle+++++++++', pathname.split("/")[1]);
    if (typeof handle[rutaPerHandle] === 'function') {
        handle[rutaPerHandle](response, pathname, postData, _extname);
    } else {
        console.log(`*** No s´ha trobat la function per el ${ pathname }. ***`);
        response.writeHead(404, { "Content-Type": "text/html" });
        response.write(`*** 404 No trobada; la ruta ${ pathname }  no existeix. ***`);
        response.end();

    }
}

exports.route = route;