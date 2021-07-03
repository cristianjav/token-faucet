# TOKEN FAUCET

Este proyecto fue creado con [Create React App](https://github.com/facebook/create-react-app).
Tambien se usó [Hardhat](https://github.com/nomiclabs/hardhat).

## Pasos para iniciarlo.

Se debe iniciar un nodo de Hardhat:
### `npx hardhat node`

Se deben compilar los contratos:
### `npx hardhat compile`

Se deben deployar los contratos y guardar la address del contrato:
### `npx hardhat run './scripts/deploy.js' --network local`

Luego hay que configurar CONTRACT_ADDRESS editando el archivo:
### `./src/constantsa/addresses.js`

Solo queda ejecutar el frontend:
### `npm start`

## Config de MetaMask
En MetaMask se debe seleccionar la red localhost.

Al ejecutar el primer paso de la sección anterior Hardhat mostrará
10 addresses y sus privates keys. Se debe copiar la private key de la primer address e importarla en MetaMask. (Se importa la primera porque es la address que usa Hardhat por defecto para deployar contratos.)

## Config de la faucet
Se debe setear el monto que entrega la faucet en cada reclamo.

## Scripts disponibles para React (frontend)

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
