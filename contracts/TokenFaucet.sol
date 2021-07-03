pragma solidity ^0.8.3;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract TokenFaucet is ERC20, Ownable {
    uint256 private _cantidadDeTokens; //La cantidad de tokens que entrega al faucet en cada reclamo.
    uint256 private _cantidadDeMinutos; //La cantidad de minutos de espera entre cada reclamo.
    mapping(address => uint256) private _ultimoClaim;

    /**
     * El supply total de tokens quedan en el contrato y son distribuidos a travéz de la faucet y el farmeo.
     * El owner del contrato decide cuantos token se pueden reclamar en la faucet.
     * El owner del contrato decide cada cuanto tiempo se pueden reclamar tokens.
     * Una vez deployado el contrato el owner debe setear _cantidadDeTokens y _cantidadDeMinutos.
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(address(this), 1000 * 10**18);
    }

    /**
     * @dev Funcion que le entrega los tokens a los usuarios de la faucet.
     */
    function faucet() external {
        require(
            _cantidadDeTokens > 0,
            "Faucet: El monto a entregar es 0. La faucet fue pausada o no se seteo el monto a entregar."
        );
        require(
            balanceOf(address(this)) > _cantidadDeTokens,
            "Faucet: No quedan mas tokens para repartir."
        );
        require(
            _ultimoClaim[msg.sender] <= (block.timestamp - _cantidadDeMinutos),
            "Faucet: Todavia no podes reclamar. Es muy pronto"
        );

        console.log(
            "[Contrato] El usuario ",
            msg.sender,
            " llama la funcion faucet"
        );
        _transfer(address(this), msg.sender, _cantidadDeTokens);
        _ultimoClaim[msg.sender] = block.timestamp;
    }

    /**
     * @dev Funcion para comprobar si un usuario puede claimear o no.
     * @param _address La direccion del usuario que se comprueba.
     */
    function checkPermiso(address _address) public view returns (bool) {
        if (_ultimoClaim[_address] > (block.timestamp - _cantidadDeMinutos)) {
            return false;
        }
        return true;
    }

    /**
     * @dev Setea el monto de tokens que se distribuyen cada vez que alguien reclama en la faucet.
     * @param _amount Cantidad de tokens a repartir.
     */
    function setAmount(uint256 _amount) external onlyOwner {
        console.log(
            "[Contrato] Se setea la cantidad de tokens a entregar a: ",
            _amount
        );
        _cantidadDeTokens = _amount;
    }

    /**
     * @dev Devuelve la cantidad de tokens que se entregan en la faucet.
     */
    function amount() public view returns (uint256) {
        return _cantidadDeTokens;
    }

    /**
     * @dev Setea el tiempo de espera entre cada reclamo. Modifica el valor _cantidadDeMinutos.
     * @param _minutos Cantidad de minutos
     * Si _cantidadDeMinutos es 0 la faucet se puede usar sucesivamente hasta quedarse sin fondos.
     */
    function setMinutos(uint256 _minutos) external onlyOwner {
        console.log(
            "[Contrato] Se setea la cantidad de minutos de espera de la faucet: ",
            _minutos
        );
        _cantidadDeMinutos = _minutos;
    }

    /**
     * @dev Devuelve la cantidad de minutos de espera que tiene el reclamo.
     */
    function minutos() public view returns (uint256) {
        return _cantidadDeMinutos;
    }
}
