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
        uint256 earned;
        uint256 ingreso;
        uint256 ultimoClaim;
        uint256 balance;
    }

    mapping(address => UserInfo) public userData;

    /// @dev El ratio de entrega de tokens. Porcentaje por bloque.
    uint256 private _ratio;

    event Deposit(address _user, uint256 _amount);
    event Withdraw(address _user, uint256 _amount);
    event Claim(address _user, uint256 _amount);

    constructor(IERC20 _tokenFaucet) {
        tokenFaucet = _tokenFaucet;
    }

    /// @notice Un usuario deposita TokenFaucet y mintea TokenStaked
    function deposit(uint256 _amount) external {
        require(_amount > 0, "TokenStaker: El monto recibido es 0.");

        userData[msg.sender].balance = userData[msg.sender].balance.add(
            _amount
        );

        if (userData[msg.sender].ingreso != 0) {
            guardarGanancia(msg.sender);
        }

        userData[msg.sender].ingreso = block.number;

        tokenFaucet.transferFrom(msg.sender, address(this), _amount);

        _mint(msg.sender, _amount);

        emit Deposit(msg.sender, _amount);
    }

    /// @notice Retira todo el deposito más la ganancia generada
    function withdrawAll() external {
        require(
            balanceOf(msg.sender) > 0,
            "TokenStacker: No tiene fondos para retirar"
        );

        uint256 _ganancia = calcularGanancia(msg.sender);
        uint256 _total = balanceOf(msg.sender).add(_ganancia);

        actualizarUser(msg.sender, balanceOf(msg.sender));

        if (_ganancia > 0) {
            pedirTokens(_ganancia);
        }

        transfer(msg.sender, _total);

        emit Withdraw(msg.sender, _total);
    }

    /// @notice Retira una parte del deposito más la ganancia generada
    /// @param _amount El monto a retirar
    function withdraw(uint256 _amount) external {
        require(
            balanceOf(msg.sender) > 0,
            "TokenStacker: No tiene fondos para retirar"
        );

        uint256 _ganancia = calcularGanancia(msg.sender);
        uint256 _total = _amount.add(_ganancia);

        actualizarUser(msg.sender, _amount);

        if (_ganancia > 0) {
            pedirTokens(_ganancia);
        }

        transfer(msg.sender, _total);

        emit Withdraw(msg.sender, _total);
    }

    /// @notice Claimea la ganancia sin retirar el deposito
    function claim() external {
        require(
            balanceOf(msg.sender) > 0,
            "TokenStacker: No tiene fondos para retirar"
        );

        guardarGanancia(msg.sender);

        uint256 _ganancia = userData[msg.sender].earned;

        require(_ganancia > 0, "TokenStacker: No tiene ganancias para retirar");

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
    function pedirTokens(uint256 _amount) internal {
        tokenFaucet.transfer(address(this), _amount);
    }

    /// @notice Calcula la ganancia generada
    function calcularGanancia(address _user) internal view returns (uint256) {
        uint256 ganancia;

        if (
            userData[_user].ultimoClaim == 0 ||
            userData[_user].ingreso > userData[_user].ultimoClaim
        ) {
            ganancia = block.number.sub(userData[_user].ingreso).mul(_ratio);
        } else {
            ganancia = block.number.sub(userData[_user].ultimoClaim).mul(
                _ratio
            );
        }

        return (ganancia);
    }

    /// @notice Actualiza la ganancia de un usuario
    function guardarGanancia(address _user) internal {
        userData[_user].earned = userData[_user].earned.add(
            calcularGanancia(_user)
        );
    }
}