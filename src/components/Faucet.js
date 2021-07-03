import { Contract } from "@ethersproject/contracts"
import { useState, useContext } from "react"
import { Card, Button, Row, Col } from "react-bootstrap"
import { useWeb3Context } from "web3-react"
import Message from './Message'
import ContractContext from "../utils/contractContext"

const Faucet = (props) => {
    const contractData = useContext(ContractContext)
    const context = useWeb3Context()

    const [userBalance, setUserBalance] = useState()
    const [showBalance, setShowBalance] = useState()

    async function faucet() {
        const signer = context.library.getSigner(context.account)
        const contract = new Contract(contractData.address, contractData.abi, signer)
        contract.faucet()
    }

    async function balance() {
        if (showBalance) {
            setShowBalance(false)
        } else {
            const contract = new Contract(contractData.address, contractData.abi, context.library)
            const balance = await contract.balanceOf(context.account)

            setUserBalance(balance.toString())
            setShowBalance(true)
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
    )
}
export default Faucet