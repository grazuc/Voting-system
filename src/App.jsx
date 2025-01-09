import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import {
  VotingContractAddress,
  VotingContractABI,
  VoterRegistrationContractAddress,
  VoterRegistrationContractABI,
} from "./contractsConfig";
import "./App.css"; // Archivo CSS actualizado para el diseño
import logo from "./assets/loguito2.png";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [votingContract, setVotingContract] = useState(null);
  const [registrationContract, setRegistrationContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showVotePopup, setShowVotePopup] = useState(false);
  const [results, setResults] = useState([]);
  
  const originalBoletas = [
    { index: 0, name: "Patricia Bullrich - Luis Petri", img: "https://www.electoral.gob.ar/boletas/boletas.php?cmd=image&sfpg=RWxlY2Npb25lcyAyMDIzL0dFTkVSQUxFUy8wMCBEaXN0cml0byBVbmljby9QcmVzaWRlbnRlIHkgVmljZS8qMTMyIEpVTlRPUyBQT1IgRUwgQ0FNQklPLmpwZyozMzRjMWQyOGE4NjAyZDk2YmEzZmU2MTdiOWMwZmYzMjU5YzE3MDAxMzgzZGFlM2IzOGVmZDQxMTVhNzE0Njcy" },
    { index: 1, name: "Juan Schiaretti - Florencio Randazzo", img: "https://www.electoral.gob.ar/boletas/boletas.php?cmd=image&sfpg=RWxlY2Npb25lcyAyMDIzL0dFTkVSQUxFUy8wMCBEaXN0cml0byBVbmljby9QcmVzaWRlbnRlIHkgVmljZS8qMTMzIEhBQ0VNT1MgUE9SIE5VRVNUUk8gUEFJUy5qcGcqMGU3NGE0ODQ3MzFkODkxZGUwOTFiZjE4OWY3YzhiYTAyMjRhMWU1NTNlMzUzMTZkY2IwNDY1MTI3OTk5MzlmYQ" },
    { index: 2, name: "Sergio Massa - Agustin Rossi", img: "https://www.electoral.gob.ar/boletas/boletas.php?cmd=image&sfpg=RWxlY2Npb25lcyAyMDIzL0dFTkVSQUxFUy8wMCBEaXN0cml0byBVbmljby9QcmVzaWRlbnRlIHkgVmljZS8qMTM0IFVOSU9OIFBPUiBMQSBQQVRSSUEuanBnKjY2MDVmMDI3OTk5NzE0OTNhNjgwNTA2NjI3NTJmMzVkMTgwODk4MTQ4MWFjODNkODU5NGQ1YWJjNTJiODY5YzQ" },
    { index: 3, name: "Javier Milei - Victoria Villaruel", img: "https://www.electoral.gob.ar/boletas/boletas.php?cmd=image&sfpg=RWxlY2Npb25lcyAyMDIzL0dFTkVSQUxFUy8wMCBEaXN0cml0byBVbmljby9QcmVzaWRlbnRlIHkgVmljZS8qMTM1IExBIExJQkVSVEFEIEFWQU5aQS5qcGcqNzEwNDRmZTQwM2U1NDA2MWQ2YzcyMDJhNDYzOGUwMzA1OWVhNmZmNDA3ODhlNGU2OTMxNGRlYTU4ZDE0YTBhNw" },
    { index: 4, name: "Myriam Bregman - Nicolas del Caño", img: "https://www.electoral.gob.ar/boletas/boletas.php?cmd=image&sfpg=RWxlY2Npb25lcyAyMDIzL0dFTkVSQUxFUy8wMCBEaXN0cml0byBVbmljby9QcmVzaWRlbnRlIHkgVmljZS8qMTM2IEZJVC1VLmpwZyo3MjA4OTFkMjgzOGM1ZWQ5MWIzNDYwMWMxM2VhNDY1NWYyMTkwMzhmMzJlOWUzMTE2ZWU3NzAxOGU2ZTA0YTU1" },
  ];

  const [boletas, setBoletas] = useState([]);

  useEffect(() => {
    const shuffleBoletas = [...originalBoletas].sort(() => Math.random() - 0.5);
    setBoletas(shuffleBoletas);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ethereum) {
          alert("Por favor, instala MetaMask para usar esta aplicación.");
          return;
        }

        const metamaskProvider = new BrowserProvider(window.ethereum);
        const signer = await metamaskProvider.getSigner();
        const account = await signer.getAddress();

        const voting = new Contract(
          VotingContractAddress,
          VotingContractABI,
          signer
        );

        const registration = new Contract(
          VoterRegistrationContractAddress,
          VoterRegistrationContractABI,
          signer
        );

        setProvider(metamaskProvider);
        setSigner(signer);
        setVotingContract(voting);
        setRegistrationContract(registration);
        setAccount(account);
      } catch (error) {
        console.error("Error al conectar:", error);
      }
    };

    init();
  }, []);

  const vote = async () => {
    console.log(selectedCandidate)
    if (!votingContract) {
      alert("El contrato de votación no está inicializado.");
      return;
    }
    if (selectedCandidate === null) {
      alert("Por favor, selecciona un candidato antes de votar.");
      return;
    }
    try {
      const tx = await votingContract.vote(selectedCandidate);
      await tx.wait();
      alert("Voto emitido correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al emitir el voto.");
    }
  };

  const fetchResults = async () => {
    if (!votingContract) {
      alert("El contrato de votación no está inicializado.");
      return;
    }
    try {
      const candidates = await votingContract.getCandidates();
      const formattedResults = candidates.map((candidate, index) => ({
        name: originalBoletas[index]?.name || "Desconocido",
        votes: parseInt(candidate.voteCount, 10),
      }));
      setResults(formattedResults);
      setShowPopup(true);
    } catch (error) {
      console.error(error);
      alert("Error al obtener los resultados.");
    }
  };

  const closePopup = () => setShowPopup(false);

  const handleVoteConfirm = async () => {
    setShowVotePopup(false);
    await vote();
  };

  const openVotePopup = () => {
    if (selectedCandidate === null) {
      alert("Por favor, selecciona un candidato antes de votar.");
      return;
    }
    setShowVotePopup(true);
  };

  const totalVotes = results.reduce((sum, candidate) => sum + candidate.votes, 0);

  return (
    <div>
      <div className="header">
        <p>Conectado como: {account || "Desconectado"}</p>
      </div>

      <div className="container">
        <div className="sidebar">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
        </div>

        <div className="main-content">
          <h1>PRESIDENTE</h1>
          <hr className="divider" />
          <div className="boletas">
  {boletas.map((boleta, index) => (
    <div
      key={index}
      className={`boleta ${
        selectedCandidate === boleta.index ? "selected" : ""
      }`}
      onClick={() => setSelectedCandidate(boleta.index)} // Usa el índice original
    >
      <img src={boleta.img} alt={boleta.name} />
    </div>
  ))}
</div>


          <div className="button-group">
            <button className="confirm-btn" onClick={openVotePopup}>
              Confirmar Voto
            </button>
            <button className="checkResults-btn" onClick={fetchResults}>
              Ver Resultados
            </button>
          </div>
        </div>
      </div>

      {showVotePopup && (
  <div className="popup">
    <div className="popup-content">
      <h2>Confirmación de Voto</h2>
      <p>
        Usted está votando por:{" "}
        {originalBoletas[selectedCandidate]?.name || "Candidato desconocido"}
      </p>
      <button className="confirm-btn" onClick={handleVoteConfirm}>
        Confirmar
      </button>
      <button
        className="close-btn"
        onClick={() => setShowVotePopup(false)}
      >
        Cancelar
      </button>
    </div>
  </div>
)}



      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Resultados</h2>
            <ul>
              {results.map((result, index) => (
                <li key={index}>
                      {result.name}: {((result.votes / totalVotes) * 100).toFixed(2)}% ({result.votes} {result.votes === 1 ? "voto" : "votos"})
                </li>
              ))}
            </ul>
            <button className="close-btn" onClick={closePopup}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="footer">
        <p>© 2025 Vot.Ar. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};

export default App;