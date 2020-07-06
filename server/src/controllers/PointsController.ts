import {Request, Response} from 'express';
import knex from '../database/connection';

//Query = Ele é opcional e usado para filtro, paginação e outras coisas.
//Params = Ele vem na rota e é obrigatorio, usado sempre para criação e edição.

class PointsController{
  
  async index(request : Request, response : Response) {
      // cidade, uf, items (Query Params)
      const { city, uf, items } = request.query;

      console.log(city, uf, items);

      const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

      const point = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*');

        const serializedPoints = point.map(point => {
          return {
              ...point,
              // image_url: `http://localhost:3333/uploads/${item.image}`,
              image_url: `http://128.104.101.9:3333/uploads/${point.image}`,
          };
      });
    //   return response.json({ ok: true });
    // return response.json({point});    
    // return response.json(point);
    return response.json(serializedPoints);

  }

  // Serialização
  // API Transform
   
  async show(request : Request, response : Response) {
      const { id } = request.params;

      const point = await knex('points').where('id', id).first();

      if (!point) {
          return response.status(400).json({ messagem: 'Point not found.'})
      }

    //   
    // SELECT * FROM ITEMS
    //   JOIN POINT_ITENT_ITEMS ON ITEMS.ID = POINT_ITEMS.ITEM_ID
    // WHERE POINT_ITEMS.POINT_ID = { ID }
    // 
    const serializedPoints = {
          ...point,
          // image_url: `http://localhost:3333/uploads/${item.image}`,
          image_url: `http://128.104.101.9:3333/uploads/${point.image}`,
      };

    const items = await knex('items')
       .join('point_items', 'items.id', '=', 'point_items.item_id')
       .where('point_items.point_id', id)
       .select('items.title');

    //   return response.json(point);
    // return response.json({ point, items });
    return response.json({ point: serializedPoints, items });
  }
  
  async create(request : Request, response: Response) {
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items
    } = request.body;

     const trx = await knex.transaction();

    const point = {
        // image : 'image-fake',
        // image : 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
        image : request.file.filename,
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
    }

    const insertedIds = await trx('points').insert(point);

    const point_id = insertedIds[0];

    // const pointItems = items.map((item_id: Number) => {
    //     return {
    //         item_id,
    //         point_id,
    //     };
    // })
    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: Number) => {
      return {
          item_id,
          point_id,
      };
  })

    await trx('point_items').insert(pointItems);

    await trx.commit();

    return response.json({
        id: point_id,
        ...point,
    });
  };
}

export default PointsController;