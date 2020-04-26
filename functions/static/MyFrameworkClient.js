// Utilitats amb el pattern namesapce.
// Solament executar a javascript client
//
// NOTA: de moment no carrego MyFrameworkClients.js como un módul
//       No cal perque  MyFrameworkClients.js crea el objecte 
//       MyFramework que ya té tots els métodes preparats.
//       De moment no farem exportacions perque tot es utilitzable
//       i els metodes que hi ha publics ja enmascaren els privats. 

// NOTA: aquest fitxer ha d'estar al directori 'static'




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

MyFramework.namespace("Utils").Templates = (function() {

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

/* MyFramework.Node.Utils.Templates.templater `<figure>
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

Object.defineProperty(MyFramework.Utils, 'Templates', { writable: false, configurable: false });
Object.defineProperty(MyFramework.Utils.Templates, 'templater', { writable: false, configurable: false });


// ----------------------------------
 // window.MyFramework = MyFramework;   // de momento no cal 
// ----------------------------------

// ----------------------------------
// Exportacions
// ----------------------------------