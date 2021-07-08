// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract TokenFaucet is ERC20("TokenFaucet", "TokenFCT"), Ownable {
    /// @dev Cantidad de tokens que entregará la faucet en cada claim.
    uint256 private _cantidadDeTokens;
    
    /// @dev Cantidad de minutos de espera entre cada claim.
    uint256 private _cantidadDeMinutos;

    /// @dev Registro del momento en que las addresses hacen el claim.
    mapping(address => uint256) private _ultimoClaim;
    
    /// @notice Se emite cada vez que alguien claimea tokens.
    event tokenClaimed(address claimer, uint amount, uint time);

    /// @notice Se emite cada vez que el owner setea los minutos.
    event minutosChanged(uint oldMinutos, uint newMinutos, uint time);

    /// @notice Se emite cada vez que el owner setea la cantidad de tokens que entrega la faucet.
    event amountChanged(uint oldAmount, uint newAmount, uint time);

    /**
     * @notice El supply total de tokens quedan en el contrato y son distribuidos a travéz de la faucet y el farmeo.
     * El owner del contrato decide cuantos token se pueden reclamar en la faucet.
     * El owner del contrato decide cada cuanto tiempo se pueden reclamar tokens.
     * Una vez deployado el contrato el owner debe setear _cantidadDeTokens y _cantidadDeMinutos.
     */
    constructor() {
        _mint(address(this), 1000 * 10**18);
    }

    /// @notice Funcion que le entrega los tokens a los usuarios de la faucet.
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

        emit tokenClaimed(msg.sender, _cantidadDeTokens, block.timestamp);
    }

    /**
     * @notice Funcion para comprobar si un usuario puede claimear o no.
     * @param _address La direccion del usuario que se comprueba.
     */
    function checkPermiso(address _address) public view returns (bool) {
        if (_ultimoClaim[_address] > (block.timestamp - _cantidadDeMinutos)) {
            return false;
        }
        return true;
    }

    /**
     * @notice Setea el monto de tokens que se distribuyen cada vez que alguien reclama en la faucet.
     * @param _amount Cantidad de tokens a repartir.
     */
    function setAmount(uint256 _amount) external onlyOwner {
        console.log(
            "[Contrato] Se setea la cantidad de tokens a entregar: ",
            _amount
        );

        uint256 amountAnterior = _cantidadDeTokens;
        _cantidadDeTokens = _amount;

        emit amountChanged(amountAnterior, _amount, block.timestamp);
    }

    /**
     * @notice Devuelve la cantidad de tokens que se entregan en la faucet.
     */
    function amount() public view returns (uint256) {
        return _cantidadDeTokens;
    }

    /**
     * @notice Setea el tiempo de espera entre cada reclamo. Modifica el valor _cantidadDeMinutos.
     * Si _cantidadDeMinutos es 0 la faucet se puede usar sucesivamente hasta quedarse sin fondos.
     * @param _minutos Cantidad de minutos
     */
    function setMinutos(uint256 _minutos) external onlyOwner {
        console.log(
            "[Contrato] Se setea la cantidad de minutos de espera de la faucet: ",
            _minutos
        );
        uint256 minutosAnterior = _cantidadDeMinutos;
        _cantidadDeMinutos = _minutos;
        emit minutosChanged(_minutos, minutosAnterior, block.timestamp);
    }

    /**
     * @notice Devuelve la cantidad de minutos de espera que tiene el reclamo.
     */
    function getMinutos() public view returns (uint256) {
        return _cantidadDeMinutos;
    }
}
