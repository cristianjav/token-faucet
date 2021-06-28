import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import TokenABI from './artifacts/contracts/TokenFaucet.sol/TokenFaucet.json'
import Faucet from './components/Faucet';
import Sender from './components/Sender';
import Encabezado from './components/Encabezado';

function App() {
  const ABI = TokenABI;
  const ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  return (
    <div className='row align-items-center'>
      <Container>
        <Encabezado />
        <Row>
          <Col>
          <Faucet tokenABI={ABI} tokenAddress={ADDRESS}></Faucet>
          </Col>
          <Col>
          <Sender tokenABI={ABI} tokenAddress={ADDRESS}></Sender>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
