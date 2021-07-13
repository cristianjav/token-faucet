// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 
/// @dev Cuando un usuario stackea token recibe STKD como comprobante de su depósito y comienza a generar tokenFaucet
contract TokenStacker is ERC20("StakedToken", "STKD") {
    using SafeMath for uint256;

    IERC20 public tokenFaucet;

    /// @notice Info del usuario.
    struct UserInfo {
        uint earned;
        uint ingreso;
        uint ultimoClaim;
        uint balance;
    }

    mapping (address => UserInfo) public userData;
    
    /// @notice El ratio de entrega de tokens. Porcentaje por bloque.
    uint private _ratio;

    event Deposit(address _user, uint _amount);
    
    event Withdraw(address _user, uint _amount);

    event Claim(address _user, uint _amount);

    constructor(IERC20 _tokenFaucet) {
        tokenFaucet = _tokenFaucet;
    }
    
    /// @notice recibe TokenFaucet y mintea TokenStaked
    function deposit(uint _amount) external {
        require(_amount > 0, "TokenStaker: El monto recibido es 0.");

        tokenFaucet.transferFrom(msg.sender, address(this), _amount);
        
        userData[msg.sender].balance = _amount;
        userData[msg.sender].ingreso = block.number;

        _mint(msg.sender, _amount);
        
        emit Deposit(msg.sender, _amount);
    }

    /// @notice Retira todo el deposito más la ganancia generada
    function withdrawAll() external {
        require( balanceOf(msg.sender) > 0, "TokenStacker: No tiene fondos para retirar");

        uint256 _ganancia = calcularGanancia(msg.sender);
        uint256 _total = balanceOf(msg.sender).add(_ganancia);
        
        actualizarUser(msg.sender, balanceOf(msg.sender));
        
        if(_ganancia > 0) { pedirTokens(_ganancia); }
        
        transfer(msg.sender, _total);
        
        emit Withdraw(msg.sender, _total);
    }

    /// @notice Retira una parte del deposito más la ganancia generada
    /// @param _amount El monto a retirar
    function withdraw(uint256 _amount) external {
        require( balanceOf(msg.sender) > 0, "TokenStacker: No tiene fondos para retirar");

        uint256 _ganancia = calcularGanancia(msg.sender);
        uint256 _total = _amount.add(_ganancia);
        
        actualizarUser(msg.sender, _amount);

        if(_ganancia > 0) { pedirTokens(_ganancia); }

        transfer(msg.sender, _total);

        emit Withdraw(msg.sender, _total);
    }

    /// @notice Claimea la ganancia sin retirar el deposito
    function claim() external {
        require( balanceOf(msg.sender) > 0, "TokenStacker: No tiene fondos para retirar");
        
        uint256 _ganancia = calcularGanancia(msg.sender);
        require( _ganancia > 0, "TokenStacker: No tiene ganancias para retirar");

        actualizarUser(msg.sender, 0);

        pedirTokens(_ganancia);
        
        transfer(msg.sender, _ganancia);

        emit Claim(msg.sender, _ganancia);
    }

    /// @notice Actualiza los datos del usuario cada vez que retira o claimea
    /// @param _user Address del usuario
    /// @param _balance El monto que se retira del deposito
    function actualizarUser(address _user, uint256 _balance) internal {
        userData[_user].balance = userData[_user].balance.sub(_balance);
        userData[_user].earned = 0;
        userData[_user].ultimoClaim = block.number;
    }

    /// @dev Pide tokens a TokenFaucet
    /// @param _amount Cantidad de tokens a pedir
    /// todo Crear el TokenFaucet la lógica y permisos
    function pedirTokens(uint _amount) internal {
        tokenFaucet.transfer(address(this), _amount);
    }

    function calcularGanancia(address _user) internal view returns(uint){
        /// @dev Desde - Hoy * Ratio
        uint ganancia = userData[_user].ingreso.sub(block.number).mul(_ratio);
        return(ganancia);
    }
}