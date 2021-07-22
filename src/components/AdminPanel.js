import { Contract } from "@ethersproject/contracts";
import { useEffect, useState, useContext } from "react";
import { useWeb3Context } from "web3-react";
import ContractContext from "../utils/contractContext";
import { Row, Col, Card, Button, InputGroup, FormControl } from "react-bootstrap";

function Admin() {
    const contractData = useContext(ContractContext);
    const context = useWeb3Context();

    /// Declaro el contrato acá para hacerlo una sola vez
    const signer = context.library.getSigner(context.account);
    const contract = new Contract(contractData.address, contractData.abi, signer);

    const [isManager, setIsManager] = useState();
    const [amountTkn, setAmountTkn] = useState();
    const [minutosTkn, setMinutosTkn] = useState();
    const [stackerAddressTkn, setStackerAddressTkn] = useState();

    useEffect(() => {
        checkIfManager();
    });

    async function checkIfManager() {
        let manager = await contract.comprobarSiManager(context.account);
        if (manager) {
            console.log("Es: ", context.account);
            setIsManager(true);
        } else {
            setIsManager(false);
        }
    }

    async function setAmount() {
        contract.setAmount(amountTkn);
    }

    async function setMinutos() {
        contract.setMinutos(minutosTkn);
    }

    async function setStakerAddress() {
        contract.setStackerAddress(stackerAddressTkn);
    }

    return (
        <div>
            {isManager ?
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <p>Cantidad de Tokens</p>
                            </Card.Title>
                            <InputGroup className='mb-3'>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Monto:</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl onChange={e => setAmountTkn(e.target.value)} placeholder='Cantidad que debe entregar la faucet.' />
                            </InputGroup>
                            <Button onClick={setAmount}>Guardar</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <p>Cantidad de Minutos</p>
                            </Card.Title>
                            <InputGroup className='mb-3'>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Minutos:</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl onChange={e => setMinutosTkn(e.target.value)} placeholder='Cantidad que debe esperar el user.' />
                            </InputGroup>
                            <Button onClick={setMinutos}>Guardar</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <p>Stacker Address</p>
                            </Card.Title>
                            <InputGroup className='mb-3'>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Address:</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl onChange={e => setStackerAddressTkn(e.target.value)} placeholder='Address del contrato que stakea.' />
                            </InputGroup>
                            <Button onClick={setStakerAddress}>Guardar</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
           : null }
        </div>
    );
}

export default Admin;