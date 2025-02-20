// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract VoterRegistration {
    // Mapping para almacenar direcciones de votantes registrados
    mapping(address => bool) public voters;

    // Dirección del administrador del contrato (el que despliega el contrato)
    address public admin;

    // Constructor
    constructor() {
        admin = msg.sender; 
    }

    // Función para registrar un votante (solo el administrador puede llamar)
    function registerVoter(address voter) external {
        require(msg.sender == admin, "Solo el administrador puede registrar votantes");
        require(!voters[voter], "El votante ya esta registrado");
        voters[voter] = true; 
    }

    // Función para verificar si un votante está registrado o no
    function isRegistered(address voter) external view returns (bool) {
        return voters[voter];
    }
}
