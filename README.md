# wsmCloudFunction

## un servidor nodejs instal.lat a una cloud function de firebase
## Instalació
- clonar el repositori
- cd functions
- npm install
- firebase emulators:start --only functions

## NOTA-1: al fitxer firebase.json li he tret
- "predeploy": ["npm --prefix \"$RESOURCE_DIR\" run lint"]
- perque no doni erros al 'preload' i surtir del pas.
- Com es un node.js molt rudimentari però didátic per apendre, no val la pena revisar errors warnings

## NOTA-2: Recordar que s´ha de canviar el base href als .html que ho tinguin

- href="http://localhost:5001/wsmcloudfunction/us-central1/wsmCloudFunction/"

- <https://us-central1-wsmcloudfunction.cloudfunctions.net/wsmCloudFunction>