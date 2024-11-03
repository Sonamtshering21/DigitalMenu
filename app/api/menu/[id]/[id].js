{/*import pool from '../../../../lib/db'; // Adjust the path according to your project structure

export default async function handler(req, res) {
  const { id } = req.query;

  // Parse ID to an integer
  const parsedId = parseInt(id, 10);

  // Check if parsedId is a valid number
  if (isNaN(parsedId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  console.log(`Received request for ID: ${parsedId}`);

  if (req.method === 'GET') {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query('SELECT * FROM menu_items WHERE id = $1', [parsedId]);

      console.log(`Query result for ID ${parsedId}:`, result.rows);

      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (error) {
      console.error('Error fetching menu item:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      if (client) {
        client.release(); // Ensure the client is released
      }
    }
  } else if (req.method === 'PUT') {
    const { user_id, dish_name, description, price, image_url } = req.body;

    // Validate request body
    if (!user_id || !dish_name || !description || price === undefined || !image_url) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ message: 'Price must be a non-negative number' });
    }

    let client;
    try {
      client = await pool.connect();
      const result = await client.query(
        'UPDATE menu_items SET user_id = $1, dish_name = $2, description = $3, price = $4, image_url = $5 WHERE id = $6 RETURNING *',
        [user_id, dish_name, description, parsedPrice, image_url, parsedId]
      );

      if (result.rowCount > 0) {
        res.status(200).json(result.rows[0]); // Return updated item
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      if (client) {
        client.release(); // Ensure the client is released
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
*/}



import supabase from '../../../../lib/subabaseclient'; // Adjust the import path according to your project structure

export default async function handler(req, res) {
    const { id } = req.query;

    // Parse ID to an integer
    const parsedId = parseInt(id, 10);

    // Check if parsedId is a valid number
    if (isNaN(parsedId)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    console.log(`Received request for ID: ${parsedId}`);

    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .select('*')
                .eq('id', parsedId)
                .single(); // Use .single() to get a single item

            if (error) {
                if (error.code === 'PGRST116') { // Item not found error code
                    return res.status(404).json({ message: 'Item not found' });
                }
                console.error('Error fetching menu item:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            console.log(`Query result for ID ${parsedId}:`, data);
            res.status(200).json(data); // Return the fetched item
        } catch (error) {
            console.error('Error fetching menu item:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else if (req.method === 'PUT') {
        const { user_id, dish_name, description, price, image_url } = req.body;

        // Validate request body
        if (!user_id || !dish_name || !description || price === undefined || !image_url) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({ message: 'Price must be a non-negative number' });
        }

        try {
            const { data, error } = await supabase
                .from('menu_items')
                .update({
                    user_id,
                    dish_name,
                    description,
                    price: parsedPrice,
                    image_url
                })
                .eq('id', parsedId)
                .select('*') // Select the updated item
                .single(); // Get the updated item

            if (error) {
                if (error.code === 'PGRST116') { // Item not found error code
                    return res.status(404).json({ message: 'Item not found' });
                }
                console.error('Error updating menu item:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(200).json(data); // Return updated item
        } catch (error) {
            console.error('Error updating menu item:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
