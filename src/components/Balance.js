import { Contract } from "@ethersproject/contracts";
import { useState, useContext, useEffect } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useWeb3Context } from "web3-react";
import ContractContext from "../utils/contractContext";

function Balance() {
    const contractData = useContext(ContractContext);
    const context = useWeb3Context();

    const [userBalance, setUserBalance] = useState();

    useEffect(() => {
        getBalance();
    });

    async function getBalance() {
        const contract = new Contract(contractData.address, contractData.abi, context.library);
        const balance = await contract.balanceOf(context.account);
        setUserBalance(balance.toString());
    }

    return (
        <Row>
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            Tu balance
                        </Card.Title>
                        <Card.Text>
                            {userBalance} TKNFCT
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}
export default Balance;