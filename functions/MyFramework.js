// Utilitats amb el pattern namesapce.

// Module pattern en Node.js: Importar i exportar en base com commonJS defineix un modul.
// https://medium.com/@nicomf1982/module-pattern-en-node-js-d358b55adfb6

// Patrons funcions autoexecutables.
// http://www.etnassoft.com/2011/03/14/funciones-autoejecutables-en-javascript/
// http://www.etnassoft.com/2011/04/13/el-patron-javascript-proxy-y-los-contextos-paralelos/



const MyFramework = {
    namespace: function(name) {
        let parts = name.split(".");
        let ns = this;

        for (let i = 0, len = parts.length; i < len; i++) {
            ns[parts[i]] = ns[parts[i]] || {};
            ns = ns[parts[i]];
        }
        return ns;
    },

    log: (function() { // log helper
        let log = "";
        return {
            add: function(msg) { log += msg + "\n"; },
            show: function() {
                console.log(log);
                log = "";
            }
        }
    })()
};
// Evitem que es puguin modificar els metodes de MyFramework.Util
Object.defineProperty(MyFramework, 'namespace', { writable: false, configurable: false });

MyFramework.namespace("Utils").IsType = (function() {

    const isArray = function isArray(value) {
        return Object.prototype.toString.call(value) == "[object Array]"
    };

    const isFunction = function isFunction(value) {
        return Object.prototype.toString.call(value) == "[object Function]"
    };

    const isRegExp = function isRegExp(value) {
        return Object.prototype.toString.call(value) == "[object RegExp]"
    };

    const isObject = function isObject(value) {
        return Object.prototype.toString.call(value) == "[object Object]"
    };
    return { // revealing module pattern. sames names
        isArray: isArray,
        isFunction: isFunction,
        isRegExp: isRegExp,
        isObject: isObject
    };
})();
// MyFramework.Utils.IsType.isObject({nom:"eee"}) // true


MyFramework.namespace("Utils").IsTypeF = (function() {

    const isArray = MyFramework.namespace("Utils").IsType.isArray;
    const isFunction = MyFramework.namespace("Utils").IsType.isFunction;
    const isRegExp = MyFramework.namespace("Utils").IsType.isRegExp;
    const isObject = MyFramework.namespace("Utils").IsType.isObject;

    return function(value) { // module-pattern
        return isArray(value) && "Array" || isFunction(value) && "Function" || isRegExp(value) && "RegExp" || isObject(value) && "Object" || "primitive";
    };
})();
// MyFramework.Utils.IsTypeF({nom:"eee"}) // "Object"	

MyFramework.namespace("Utils").SpecialsObj = (function() {

    //-------------- MyDate ---------------------------
    // MyDate utilitza el "Parasitic Constructor Pattern"
    // Aques patro s'utilitza quan fallen els altres patrons. 
    // La idea basica d'aquest patro es crear un constructor que simplement embolica
    // la creació i el retorn d'un altre objecte mentre s'assembla a un constructor típic.

    const MyDate = function MyDate() {
        var values = new Date();
        // afegim els arguments al date values 
        if (arguments.length > 0) { values.setDate.apply(values, arguments) };

        // com 'values' es un objecte, em d'utilitzar __proto__ en loc de prototype
        // Aixi cada vegada que fem un new MyDate no es crearan de nou aquestes funcions. 
        values.__proto__.yyyymmdd = function() {
            var yyyy = this.getFullYear().toString();
            var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based         
            var dd = this.getDate().toString();
            return yyyy + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]);
        }; // definim les nostres funcions

        values.__proto__.hhmmss = function() {
            function fixTime(i) { return (i < 10) ? "0" + i : i; };
            var today = new Date(),
                hh = fixTime(today.getHours()),
                mm = fixTime(today.getMinutes())
            ss = fixTime(today.getSeconds());
            return hh + ':' + mm + ':' + ss;
        }; // definim les nostres funcions

        return values;
    };
    // let myDate = new MyFramework.namespace("Utils").SpecialsObj.MyDate(8);
    // myDate.yyyymmdd(); //"2019/02/20"
    // myDate.hhmmss(); //"10:25:08"
    //-------------- Fi MyDate ---------------------------

    //---------------- MyArray -------------------------
    // MyArray utilitza el "Parasitic Constructor Pattern"
    // d'una altra manera
    function MyArray() {

        let values = new Array();
        if (arguments.length > 0) { values.push.apply(values, arguments) };

        // convertir un array a string separado por |
        values.__proto__.toPipedString = function() {
            return values.join("|")
        }

        // convertir un array a string separado por /
        values.__proto__.toDirectoryString = function() {
            return values.join("/")
        };

        // clasificar un array de strings de forma ascendente
        values.__proto__.arrayStringAsc = function() {
            return values.sort(function(a, b) {
                return a.localeCompare(b)
            })
        };

        // clasificar un array de strings de forma descendente
        values.__proto__.arrayStringDesc = function() {
            return values.sort(function(a, b) {
                return b.localeCompare(a)
            })
        };

        // clasificar un array de numeros de forma ascendente
        values.__proto__.arrayNumberAsc = function() {
            return values.sort((a, b) => a - b)
        };

        // clasificar un array de numeros de forma descendente
        values.__proto__.arrayNumberDesc = function() {
            return values.sort((a, b) => b - a)
        };

        // clasificar un array de objetos por una de sus propiedades de forma ascendente
        values.__proto__.arrayObjAsc = function(propertyName) {
            return values.sort(
                function(propertyName) {

                    // hem de retornar una funcio de 2 parametres
                    return function(object1, object2) {
                        let value1 = object1[propertyName];
                        let value2 = object2[propertyName];

                        if (value1 < value2) {
                            return -1;
                        } else if (value1 > value2) {
                            return 1;
                        } else {
                            return 0;
                        }
                    };
                }(propertyName)

            )
        };

        // clasificar un array de objetos por una de sus propiedades de forma descendente
        values.__proto__.arrayObjDesc = function(propertyName) {
            return values.sort(
                function(propertyName) {

                    // hem de retornar una funcio de 2 parametres
                    return function(object1, object2) {
                        let value1 = object1[propertyName];
                        let value2 = object2[propertyName];

                        if (value1 < value2) {
                            return 1;
                        } else if (value1 > value2) {
                            return -1;
                        } else {
                            return 0;
                        }
                    };
                }(propertyName)

            )
        };

        // eliminar elementos duplicados de una array o un string
        values.__proto__.delItemDup = (itemIterale) => {
            return [...new Set(itemIterale)]
        };

        return values;
    }


    //---------------- Fi MyArray -------------------------

    //----------------- MySet -----------------------------
    function MySet() {
        let values;
        // afegim els arguments al date values 
        if (arguments.length > 0) {
            values = new Set(...arguments)
        } else {
            values = new Set()
        };

        // com 'values' es un objecte, em d'utilitzar __proto__ en loc de prototype
        // Aixi cada vegada que fem un new MyDate no es crearan de nou aquestes funcions. 

        values.__proto__.isSuperset = function(subset) {
            for (let elem of subset) {
                if (!this.has(elem)) {
                    return false;
                }
            }
            return true;
        }

        values.__proto__.union = function(setB) {
            let union = new Set(this);
            for (let elem of setB) {
                union.add(elem);
            }
            return union;
        }

        values.__proto__.intersection = function(setB) {
            let intersection = new Set();
            for (let elem of setB) {
                if (this.has(elem)) {
                    intersection.add(elem);
                }
            }
            return intersection;
        }

        values.__proto__.difference = function(setB) {
            let difference = new Set(this);
            for (let elem of setB) {
                difference.delete(elem);
            }
            return difference;
        }

        return values;
    };

    return { // revealing module pattern. Mateixos noms
        MyDate: MyDate,
        MyArray: MyArray,
        MySet: MySet
    };

})();

MyFramework.namespace("Utils").Imprimir = (function() {
            const impObjecte = function(titul, obj) {
                    let keys = Object.keys(obj);
                    let values = Object.values(obj);
                    let llistat = `${titul}
${'-'.repeat(titul.length)}
${
keys.map(function (key, index) {
    return `${key}:  ${values[index]}`;
}).join('\n') }
${'-'.repeat(titul.length)}`
    
            return llistat
            
            } 
    return { // revealing module pattern. sames names
        impObjecte: impObjecte,
        
    };
})();
// MyFramework.Utils.Imprimir.impObjecte("Impresió objecte", {nom:"eee", edat: 34}) /


// Evitem que es puguin modificar els metodes de MyFramework.Util
Object.defineProperty(MyFramework, 'Utils', { writable: false, configurable: false });
Object.defineProperty(MyFramework.Utils, 'IsType', { writable: false, configurable: false });
Object.defineProperty(MyFramework.Utils.IsType, 'isArray', { writable: false, configurable: false });
Object.defineProperty(MyFramework.Utils.IsType, 'isFunction', { writable: false, configurable: false });
Object.defineProperty(MyFramework.Utils.IsType, 'isObject', { writable: false, configurable: false });
Object.defineProperty(MyFramework.Utils.IsType, 'isRegExp', { writable: false, configurable: false });

Object.defineProperty(MyFramework.Utils, 'IsTypeF', { writable: false, configurable: false });

Object.defineProperty(MyFramework.Utils, 'SpecialsObj', { writable: false, configurable: false });
Object.defineProperty(MyFramework.Utils.SpecialsObj, 'MyArray', { writable: false, configurable: false });
Object.defineProperty(MyFramework.Utils.SpecialsObj, 'MyDate', { writable: false, configurable: false });
Object.defineProperty(MyFramework.Utils.SpecialsObj, 'MySet', { writable: false, configurable: false });

Object.defineProperty(MyFramework.Utils, 'Imprimir', { writable: false, configurable: false });
Object.defineProperty(MyFramework.Utils.Imprimir, 'impObjecte', { writable: false, configurable: false });


MyFramework.namespace("Node.Singlentons").NodeEnvironment = (function() {

    const mySingleton = (function() {
        // Instance stores a reference to the Singleton
        let instance;

        function init() {
            // Singleton
            const env_variables_json = {
                "development": {
                    "SERVERURL": "http://localhost:8080/",
                    "PORT": 8080
                },
                "production": {
                    "SERVERURL": "http://84.126.55.62:2424/",
                    "PORT": 1144
                }
            };

            return {
                // Public methods and variables
                get_env_variables_json: function() {
                    return env_variables_json;
                },
            };
        }; // fin init

        // Get the Singleton instance if one exists
        // or create one if it doesn't
        const getInstance = function() {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
        return {
            getInstance: getInstance
        };
    })();

    const get_env_variables_json = function(value) {
        return mySingleton.getInstance().get_env_variables_json();
    };

    return {
        get_env_variables_json: get_env_variables_json
    }


})();
// MyFramework.Node.Singlentons.NodeEnvironment.get_env_variables_json()

// Evitem que es puguin modificar els metodes de MyFramework.Util
Object.defineProperty(MyFramework, 'Node', { writable: false, configurable: false });
Object.defineProperty(MyFramework.Node, 'Singlentons', { writable: false, configurable: false });
Object.defineProperty(MyFramework.Node.Singlentons, 'NodeEnvironment', { writable: false, configurable: false });

MyFramework.namespace("Node.Factories").Configurations = (function() {
    const createConfiguration = function(type) {
        let configuration;
        if (!type) throw new Error('A configuration must have a type');

        if (type === "nodeEnvironment") {
            configuration = new NodeEnvironment();
        } else if (type === "xxxxxxxxx") {
            configuration = new xxxxxx();
        } else throw new Error('type configuration don´t exist');

        configuration.type = type;
        configuration.say = function() {
            log.add(` ${ this.type } : envJSON ${ this.envJSON } `);
        }
        return configuration;
    };

    const NodeEnvironment = function() {
        // recordar que es cridará al node com: "NODE_ENV=production node xxxxx.js"
        const envJSON = MyFramework.Node.Singlentons.NodeEnvironment.get_env_variables_json();
        this.varEnvProcess = envJSON[process.env.NODE_ENV || `development`]
    };

    return {
        createConfiguration: createConfiguration
    };

})();


// MyFramework.Node.Factories.Configurations.createConfiguration('nodeEnvironment')
// MyFramework.Node.Factories.Configurations.createConfiguration('nodeEnvironment').varEnvProcess

// Evitem que es puguin modificar els metodes de MyFramework.Util
Object.defineProperty(MyFramework.Node, 'Factories', { writable: false, configurable: false });
Object.defineProperty(MyFramework.Node.Factories, 'Configurations', { writable: false, configurable: false });

MyFramework.namespace("Node.Process").Terminator = (function() {
    const terminator = function() {
        //let exec = require("child_process").exec;
        const util = require('util');
        const exec = util.promisify(require('child_process').exec);
        process.stdin.resume();

        function handle(signal) {
            console.warn(` *** process node *** `);
            async function cmd() {
                const { stdout, stderr } = await exec("ps -ef | grep node | grep -v grep | awk '{print $1, $2, $3, $8 }'");
                console.warn(`UID PID  PPID CMD`);
                if (stdout) { console.warn(` ${ stdout } \n `) };
                if (stderr) { console.warn(` ${ stderr } \n `) };
                console.log(`Signal rebuda : ${signal}. El process ${ process.pid } es cancel.la \n`);
                console.log(`Directori actual: ${process.cwd()}\n`);
                
                console.log(`${MyFramework.Utils.Imprimir.impObjecte("Impresió process.env", process.env)} `);
                process.exit(0);
            }
            cmd();
        }
        process.on('SIGINT', handle);
        process.on('SIGTERM', handle);
        process.on('uncaughtException', handle); // tinc dubtes d'aquesta senyal, em sembla que s´ha de sortir amb exit(1) perque continui: consultar llibre 'Patterns nodejs'

    };
    return { // revealing module pattern. sames names
        terminator: terminator
    }

})();

// MyFramework.Node.Process.terminator()
// Evitem que es puguin modificar els metodes de MyFramework.Util
Object.defineProperty(MyFramework.Node, 'Process', { writable: false, configurable: false });
Object.defineProperty(MyFramework.Node.Process, 'Terminator', { writable: false, configurable: false });

MyFramework.namespace("Node.Utils").Templates = (function() {
    
// http://www.etnassoft.com/2016/10/05/template-strings-en-es6-estudiando-las-nuevas-plantillas-de-cadena-en-javascript/

    function templater(strings, ...keys) {
        return function(data) {
            let temp = strings.slice();
            keys.forEach((key, i) => {
                temp[i] = temp[i] + data[key];
            });
            return temp.join('');
        }
    }
    return { // revealing module pattern. sames names
        templater: templater
    };
})();

/* 
const imgTemplate = MyFramework.Node.Utils.Templates.templater `<figure>
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

// Evitem que es puguin modificar els metodes de MyFramework.Util
Object.defineProperty(MyFramework.Node, 'Utils', { writable: false, configurable: false });
Object.defineProperty(MyFramework.Node.Utils, 'Templates', { writable: false, configurable: false });

MyFramework.namespace("Node.Utils").DinamicTemplates = (function() {
    
    // http://www.etnassoft.com/2016/10/05/template-strings-en-es6-estudiando-las-nuevas-plantillas-de-cadena-en-javascript/
    
    function htmlDinamic( literalSections, ...substs ) {
        // Utilitzem el literal crud per no  interpretar
        // caracters raros.
    let raw = literalSections.raw;
 
    let result = '';
 
    substs.forEach( ( subst, i ) => {
        // Emmagatzemem el literal que precedeix a la
        // sustitució actual
        let lit = raw[ i ];
 
        // En l'exemple, map () retorna un array:
        // Si la substitució és un array (i no una cadena),
        // la convertim.
        if ( Array.isArray( subst ) ) {
            subst = subst.join( '' );
        }
 
        // Si la substitució està precedida d'un signe de dòlar,
        // escapem caràcters (cometes, salts de línia ...).
        // Prèviament vam comprovar que es tracti d'una cadena i
        // no d'un número.
        if ( lit.endsWith( '$' ) ) {
            subst = isNaN( subst ) ? htmlEscape( subst ) : subst;
            lit = lit.slice( 0, -1 );
        }
        result += lit;
        result += subst;
    } );
 
    // Eliminem l'últim literal, el qual sempre és una
    // cadena buida
    result += raw[ raw.length - 1 ];
 
    return result; 
    }

    function htmlEscape ( str ) {
        return str.replace( /&/g, '&' )
            .replace( />/g, '>' )
            .replace( /</g, '<' )
            .replace( /"/g, '"' )
            .replace( /'/g, '&#39;' )
            .replace( /`/g, '&#96;' );
        }


        return { // revealing module pattern. sames names
            htmlDinamic: htmlDinamic
        };
    })();
    
    /* 
    var tmpl = users => htmlDinamic`
    <table>
        ${ users.map( user => htmlDinamic`
            <tr>
                <td>$${ user.id }</td>
                <td>$${ user.name }</td>
                <td>$${ user.email }</td>
                <td>$${ user.role }</td>
            </tr>
        ` ) }
    </table>
`;

var users = [
    {
        id: 1,
        name: 'Yasumi Matsuno',
        email: 'yasumi_matsuno@example.com',
        role: 'director'
    }, {
        id: 2,
        name: '<Hiroshi Minagawa>',
        email: 'hiroshi_minagawa@example.com',
        role: 'artist'
    }, {
        id: 3,
        name: 'Akihiko Yoshida',
        email: 'akihiko_yoshida@example.com',
        role: 'artist'
    }
];

console.info( tmpl( users ) );  
    */
    
    // Evitem que es puguin modificar els metodes de MyFramework.Util
    /* Object.defineProperty(MyFramework.Node, 'Utils', { writable: false, configurable: false }); */
    Object.defineProperty(MyFramework.Node.Utils, 'DinamicTemplates', { writable: false, configurable: false });
    
// ----------------------------------
// Exportacions
// ----------------------------------


module.exports.IsTypeF = MyFramework.Utils.IsTypeF;
/*  Exemple importació 
const IsTypeF = require('./MyFramework').IsTypeF;
console.log(` ${ IsTypeF( { nom: "eee" } ) }`); 
*/

module.exports.MyDate = MyFramework.Utils.SpecialsObj.MyDate;
/*  Exemple importació 
// let MyDate = require('./MyFramework').MyDate;
// let myDate = new MyFramework.namespace("Utils").SpecialsObj.MyDate(8);
// myDate.yyyymmdd(); //"2019/01/08"
// myDate.hhmmss(); //"10:25:08" 
*/

module.exports.MyArray = MyFramework.Utils.SpecialsObj.MyArray;
/*  Exemple importació 
// let MyArray = require('./MyFramework').MyArray;
// let colors=new MyArray("red", "blue", "altra", "á",  "green", "áltra");
// console.log(colors.toPipedString());
// console.log(colors.toDirectoryString());
// console.log(colors.arrayStringAsc());
// console.log(colors.arrayStringDesc());

// let numeros = new MyArray("3", 1, "35", "23",  0, "1.5");
// console.log(numeros.arrayNumberAsc());
// console.log(numeros.arrayNumberDesc());

let items = new MyArray(
        { name: 'Edward', value: 21 },
        { name: 'Sharpe', value: 37 },
        { name: 'And', value: 45 },
        { name: 'The', value: -12 },
        { name: 'Magnetic' },
        { name: 'Zeros', value: 37 }
      );
console.log(items.arrayObjAsc("name"));
console.log(items.arrayObjDesc("value"));
*/

module.exports.MySet = MyFramework.Utils.SpecialsObj.MySet;
/*  Exemple importació 
// let MySet = require('./MyFramework').MySet;
// let set = new MySet(["red", 32, "altra", 24,  "green", "áltra"]);

module.exports.Imprimir = MyFramework.Utils.Imprimir;
/*  Exemple importació 
const Imprimir = require('./MyFramework').Imprimir;
console.log(Imprimir.impObjecte("Impresió process.env", process.env));
console.log(Imprimir.impObjecte("Impresió persona", { nom: "eee", edat: 33 }));
*/

module.exports.varEnvProcess = MyFramework.Node.Factories.Configurations.createConfiguration('nodeEnvironment').varEnvProcess;
/*  Exemple importació 
// const varEnvProcess = require('./MyFramework').varEnvProcess;
// const port = varEnvProcess.PORT;
// NOTA: exemple cridar al node: NODE_ENV=production node wsm.js
*/

module.exports.terminator = MyFramework.Node.Process.Terminator.terminator;
/*  Exemple importació 
const terminator = require('./MyFramework').terminator;
terminator(); 
*/

module.exports.templater = MyFramework.Node.Utils.Templates.templater;
/*  Exemple importació 
const templater = require('./MyFramework').templater;
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
--------------
var pics = [{
    name: 'Hidetaka Miyazaki',
    src: 'Hidetaka_miyazaki.jpg',
    caption: 'Japanese God'
}, {
    name: 'Hironobu Sakaguchi',
    src: 'Hironobu_sakaguchi.jpg',
    caption: 'Another Japanese God'
}];

var myTemplateImg = pics.map(pic => imgTemplate(pic)).join('\n');
console.info(myTemplate);
*/

module.exports.htmlDinamic = MyFramework.Node.Utils.DinamicTemplates.htmlDinamic;

/*  Exemple importació 
const htmlDinamic = require('./MyFramework').htmlDinamic;
    var tmpl = users => htmlDinamic`
    <table>
        ${ users.map( user => htmlDinamic`
            <tr>
                <td>$${ user.id }</td>
                <td>$${ user.name }</td>
                <td>$${ user.email }</td>
                <td>$${ user.role }</td>
            </tr>
        ` ) }
    </table>
`;

var users = [
    {
        id: 1,
        name: 'Yasumi Matsuno',
        email: 'yasumi_matsuno@example.com',
        role: 'director'
    }, {
        id: 2,
        name: '<Hiroshi Minagawa>',
        email: 'hiroshi_minagawa@example.com',
        role: 'artist'
    }, {
        id: 3,
        name: 'Akihiko Yoshida',
        email: 'akihiko_yoshida@example.com',
        role: 'artist'
    }
];

console.info( tmpl( users ) );  
    */