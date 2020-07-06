import express, { request, response } from 'express';
import { celebrate, Joi } from 'celebrate';
import multer from 'multer';
import multerConfig from './config/multer';

// import knex from './database/connection';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

// index, show, create, update, delete

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/', (request, response) => {
    return response.json({ message: 'Hello World'});
});

routes.get('/items', itemsController.index);

// routes.post('/points', pointsController.create);
 
routes.get('/points', pointsController.index);

routes.get('/points/:id', pointsController.show);

routes.post('/points', 
  upload.single('image'),
  celebrate({
      body: Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string().required().email(),
          whatsapp: Joi.number().required(),
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
          city: Joi.string().required(),
          uf: Joi.string().required().max(2),
          items: Joi.string().required(), 
      })
  }, {
      abortEarly: false
  } 
  ),
  pointsController.create);

// Index = se for uma listagem
// show = se for exibir um unico registro de uma entidade
// create/store = se criar um registro
// update =  se atualizar um registro
// delete/destroy = se deletar um registro

export default routes;

// Service Pattern
// Repository Pattern (Data Mapper)