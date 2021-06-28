import { ethers } from "ethers";
import { useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import Message from './Message.js';

const Faucet = (props) => {
    const [userBalance, setUserBalance] = useState();
    const [showBalance, setShowBalance] = useState();

    async function faucet() {
        if (!typeof window.ethereum !== 'undefined') {
            const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(props.tokenAddress, props.tokenABI.abi, signer);

            contract.faucet(account[0], 1);
        }
    }

    async function balance() {
        if (showBalance) {
            setShowBalance(false);
        } else {
            if (!typeof window.ethereum !== 'undefined') {
                const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contract = new ethers.Contract(props.tokenAddress, props.tokenABI.abi, provider);
                const balance = await contract.balanceOf(account[0]);

                setUserBalance(balance.toString());
                setShowBalance(true);
            }
        }
    }

    return (
        <div>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <p>Faucet</p>
                            </Card.Title>
                            <Card.Text>
                                <p>Esta es la faucet. Presioná el botón para recibir un TKNFCT.</p>
                            </Card.Text>
                            <Button onClick={faucet}>¡Venga el líquido!</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <p>Tu balance de TKNFCT.</p>
                            </Card.Title>
                            <Card.Text>
                                {showBalance ? <Message balance={userBalance} /> : <Message balance='******************' />}
                            </Card.Text>
                            <Button onClick={balance}>{showBalance ? 'Ocultar balance' : 'Ver balance'}</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
export default Faucet