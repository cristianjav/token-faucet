import { ethers } from "ethers";
import { useState } from "react";
import { Row, Col, Card, Button, InputGroup, FormControl } from "react-bootstrap";

const Sender = (props) => {
    const [receiverAddress, setReceiverAddress] = useState();
    const [amount, setAmount] = useState();

    async function requestAccount() {
        window.ethereum.request({ method: 'eth_requestAccounts' })
    }

async function send() {
    if (typeof window.ethereum !== 'undefined') {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(props.tokenAddress, props.tokenABI.abi, signer);
        const tx = await contract.transfer(receiverAddress, amount);
        await tx.wait();
    }
}

return (
    <div>
        <Row>
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <p>Enviar TKNFCT</p>
                        </Card.Title>
                        <InputGroup className='mb-3'>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Adress:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl onChange={e => setReceiverAddress(e.target.value)} placeholder='Dirección que recibe los tokens.' />
                        </InputGroup>
                        <InputGroup className='mb-3'>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Monto:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl onChange={e => setAmount(e.target.value)} placeholder='La cantidad de tokens que se merece.' />
                        </InputGroup>
                        <Button onClick={send}>¡Enviar TKNFCT!</Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </div>
)
}

export default Sender;