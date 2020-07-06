import React from 'react';

// Lembrar todo o componente deve começar com letra Maiuscula, istó é primodial;
// function Header(=>) {
//     return (
//         <header>
//             <h1>E coleta</h1>
//         </header>

//     );
// }

// Conceito de propriedades do Reacts
interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
    return (
        <header>
            <h1>{props.title}</h1>
        </header>
    );
}

export default Header; 