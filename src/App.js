import { Connectors } from 'web3-react';
import Web3Provider from 'web3-react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Faucet from './components/Faucet';
import Sender from './components/Sender';
import Encabezado from './components/Encabezado';
import Admin from './components/AdminPanel';
import NetworkManager from './components/NetworkManager';
import Balance from './components/Balance';

function App() {
  const { InjectedConnector } = Connectors;
  const MetaMask = new InjectedConnector({ supportedNetworks: [1337, 5]});
  const connectors = { MetaMask }

  return (
    <div className='row align-items-center'>
      <Web3Provider connectors={connectors} libraryName='ethers.js'>
        <NetworkManager>
          <Container>
            <Encabezado />
            <Row>
              <Col>
                <Faucet />
              </Col>
              <Col>
                <Balance />
              </Col>
              <Col>
                <Sender />
              </Col>
            </Row>
            <Row>
              <Admin />
            </Row>
          </Container>
        </NetworkManager>
      </Web3Provider>
    </div>
  );
}

export default App;
