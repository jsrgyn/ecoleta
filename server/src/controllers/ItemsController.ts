import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {
    async index(request: Request, response: Response) {
        // SELECT * FROM items 
        const items = await knex('items').select('*');
        console.log(items);
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                // image_url: `http://localhost:3333/uploads/${item.image}`,
                image_url: `http://128.104.101.9:3333/uploads/${item.image}`,
            };
        });
    
        // return response.json(items);
        return response.json(serializedItems);
    }
}

export default ItemsController;