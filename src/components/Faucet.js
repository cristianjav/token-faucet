import { Contract } from "@ethersproject/contracts";
import { useState, useContext } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useWeb3Context } from "web3-react";
import ContractContext from "../utils/contractContext";

const Faucet = (props) => {
    const contractData = useContext(ContractContext);
    const context = useWeb3Context();

    async function faucet() {
        const signer = context.library.getSigner(context.account);
        const contract = new Contract(contractData.address, contractData.abi, signer);
        contract.faucet();
    }

    return (
        <Row>
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            Faucet
                        </Card.Title>
                        <Card.Text>
                            Esta es la faucet. Presioná el botón para recibir un TKNFCT.
                        </Card.Text>
                        <Button onClick={faucet}>¡Venga el líquido!</Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}
export default Faucet;