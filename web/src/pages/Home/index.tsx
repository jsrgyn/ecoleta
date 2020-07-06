import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './styles.css';

import logo from '../../assets/logo.svg';

const Home = () => {
    return (
        // <h1>Hello World</h1>
        <div id="page-home">
            <div className="content">
                {/* <img src={logo} alt="Ecoleta"/> */}
                <header>
                    <img src={logo} alt="Ecoleta"/> 
                </header>

                <main>
                    <h1>Seu marketplace de coleta de resíduos</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

                    {/* <a href="/cadastro">
                        <span>
                            {/* > */}
                            {/* <FiLogIn /> */}
                        {/* </span> */}
                        {/* <strong>Cadastre um ponto de coleta</strong> */}
                    {/* </a>  */}

                    <Link to="/create-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}

export default Home;