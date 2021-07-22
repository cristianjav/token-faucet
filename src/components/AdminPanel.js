import { Contract } from "@ethersproject/contracts"
import { useEffect, useState, useContext } from "react"
import { useWeb3Context } from "web3-react"
import ContractContext from "../utils/contractContext"
import { Row, Col, Card, Button, InputGroup, FormControl } from "react-bootstrap";

function Admin() {
    const contractData = useContext(ContractContext);
    const context = useWeb3Context();

    const [isManager, setIsManager] = useState();
    const [amountTkn, setAmountTkn] = useState();

    useEffect(() => {
        checkIfManager();
    });

    async function checkIfManager() {
        const signer = context.library.getSigner(context.account);
        const contract = new Contract(contractData.address, contractData.abi, signer);

        let manager = await contract.comprobarSiManager(context.account);
        if (manager) {
            console.log("Es: ", context.account);
            setIsManager(true);
        } else {
            setIsManager(false);
        }
    }

    async function setAmount() {
        const signer = context.library.getSigner(context.account);
        const contract = new Contract(contractData.address, contractData.abi, signer);
        contract.setAmount(amountTkn);
    }

    return (
        <div>
            {isManager ?
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <p>Administración</p>
                            </Card.Title>
                            <InputGroup className='mb-3'>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Monto:</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl onChange={e => setAmountTkn(e.target.value)} placeholder='Cantidad que debe entregar la faucet.' />
                            </InputGroup>
                            <Button onClick={setAmount}>Guardar Cambios</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
           : null }
        </div>
    )
}

export default Admin