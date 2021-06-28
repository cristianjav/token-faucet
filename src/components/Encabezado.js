import { Jumbotron } from "react-bootstrap";

const Encabezado = (props) => {
    return(
        <div>
            <Jumbotron className='text-center'>
                <h1>BIENVENIDO A TOKEN FAUCET</h1>
                <p>Esta es una faucet que armé para probar como usar smart contracts y React.</p>
                <p>¡Apretá los botones!</p>
            </Jumbotron>
        </div>
    )
}

export default Encabezado;