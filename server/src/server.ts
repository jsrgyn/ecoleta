import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errors } from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// Rota: Endereço completo da requisição.
// Recurso: Qual entidade estamos acessando do sistema.

// GET: Buscar uma ou mais informações;
// POST: Criar uma nova informação no back-end;
// PUT: Atualizar uma informação existente do back-end;
// DELETE: Remover uma informação do back-end;

// POST http://localhost:3333/users = Criar um usuário;
// GET http://localhost:3333/users = Listar usuário;
// GET http://localhost:3333/users/5 = Buscar dados do usuário com ID 5;

// Request Param: Parâmetros que vem na própria rota que identificam um recurso;
// Query Param: Parâmetros que vem na própria rota geralmente opcionais para filtros, paginação;
// Request Body: Parâmetros para criação/atualização de informações

const users = [
    'Diego', //0
    'Cleiton', //1
    'Robson', //2
    'Daniel' //3
];

// app.get('/users', (request, response) => {
//     console.log('Listagem de usuário');

//     //response.send('Hello Word');

//     //JSON
//     // response.json([
//     //     'Diego',
//     //     'Cleiton',
//     //     'Robson',
//     //     ''
//     // ])
//     const search = String(request.query.search);

//     console.log(search);

//     const filteredUsers = users.filter(user => user.includes(search));

//     // response.json(users);
//     response.json(filteredUsers);
// });

// app.get('/users/:id', (request, response) => {
//     const id = Number(request.params.id);

//     const user = users[id];

//     return response.json(user);
// });

// app.post('/users', (request, response) => {
//     // const user = {
//     //     name: 'Diego',
//     //     email: 'diego@reocketseat.com.br'
//     // }; 
//    const data = request.body;
//    console.log(data);

//    const user = {
//         name: data.name,
//         email: data.email
//     };

//     return response.json(user);
// //   return response.json(data);
// });

// app.get('/', (request, response) => {
//     return response.json({message: 'Hello World'});
// });

app.use(errors());

app.listen(3333);