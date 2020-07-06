// import React from 'react';
// import logo from './logo.svg';
import './App.css';

// function App() {
  // return (
    // <div className="App">
    //   <header className="App-header">
        /* <img src={logo} className="App-logo" alt="logo" /> */
        /* <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */
        // <h1>Hello World </h1>
        // <p>Oi</p>
        // <h1>Hello World</h1>

      /* </header>
    </div> */
  // );
  // return React.createElement('h1', { children: 'Hello World - O Antigo React erá assim!'})
  // 
  

  // return (
      // <h1>Hello World - Agora o React é assim, facilitando a vida do programador!</h1>
  // );
// }

//JSX: Sintaxe de XML dentro do JavaScript 

// Para trabalhar com status
import React, { useState } from 'react';

import Header from './Header01';

function App() {
  // const counter = 1;
  let counter = 1;
  
  //Metodologia de mutabilidade.
  const [ counterStaduts, setcounterStaduts ] = useState(0); //[valor do estado, função pra atualizar o valor do estatus];

  function handleButtonClick(){
    console.log('oi');
    console.log();
    counter++; 
    console.log(counter);

    setcounterStaduts(counterStaduts + 1);
  }

  return (
    <div>
      <Header title="eColeta " />
      <h1>Conteúdo da Aplicação</h1>
      <h1>{counter}</h1>
      <h3>{counterStaduts}</h3>
      <h3>{counterStaduts * 2}</h3>
      <Header title={`O contador é: ${counterStaduts}`} />
      <button type="button" onClick={
                            //console.log
                            handleButtonClick
      }>Aumentar</button>  
    </div>
  )
}

export default App;
