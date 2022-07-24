import connection from "../dbStrategy/postgres";

// GET Categories - Envia categorias
export async function getCategories(req, res) {
    try {
        await connection.query('SELECT * FROM categories').then((categories) => {
            return res.send(categories.rows).status(200);
        });
    } catch(error) {
        return res.sendStatus(500);
    }
}

// POST Categories - Insere categoria nova
export async function postCategories(req, res) {
    try {
        const newCategory = req.body;
    
        const categorySchema = joi.object({
            name: joi.string().required()
        });
    
        const { error } = categorySchema.validate(newCategory);
    
        if (error) {
            return res.sendStatus(400);
        }
    
        // alreadyExists contém os elementos que possuem o mesmo nome da categoria nova recebida pelo body
        const { rows: alreadyExists } = await connection.query(
            `SELECT * FROM categories WHERE name=$1`, [
                newCategory.name
            ]
        );
    
        // se o tamanho de alreadyExists for diferente de 0 (não existe categoria com esse nome), então é criado
        if (alreadyExists.length === 0) {
            await connection.query(
                `INSERT INTO categories (name) VALUES ($1);`, [
                    newCategory.name
                ]
            );
            return res.sendStatus(201);
        } else {
            return res.sendStatus(409);
        }
    } catch(error) {
        return res.sendStatus(500);
    }
}