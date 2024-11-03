{/*import pool from '../../../../lib/db'; // Adjust the path according to your project structure

// Handle GET request to fetch a menu item by ID
export async function GET(req, { params }) {
  const { id } = params; // Extract ID from params

  // Parse ID to an integer
  const parsedId = parseInt(id, 10);

  // Check if parsedId is a valid number
  if (isNaN(parsedId)) {
    return new Response(JSON.stringify({ message: 'Invalid ID' }), { status: 400 });
  }

  console.log(`Received request for ID: ${parsedId}`);

  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT * FROM menu_items WHERE id = $1', [parsedId]);

    console.log(`Query result for ID ${parsedId}:`, result.rows);

    if (result.rows.length > 0) {
      return new Response(JSON.stringify(result.rows[0]), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Item not found' }), { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  } finally {
    if (client) {
      client.release(); // Ensure the client is released
    }
  }
}

// Handle PUT request to update a menu item by ID
export async function PUT(req, { params }) {
  const { id } = params; // Extract ID from params
  const { user_id, dish_name, description, price, image_url } = await req.json(); // Get the request body

  // Parse ID to an integer
  const parsedId = parseInt(id, 10);

  // Validate request body
  if (!user_id || !dish_name || !description || price === undefined || !image_url) {
    return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
  }

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice < 0) {
    return new Response(JSON.stringify({ message: 'Price must be a non-negative number' }), { status: 400 });
  }

  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      'UPDATE menu_items SET user_id = $1, dish_name = $2, description = $3, price = $4, image_url = $5 WHERE id = $6 RETURNING *',
      [user_id, dish_name, description, parsedPrice, image_url, parsedId]
    );

    if (result.rowCount > 0) {
      return new Response(JSON.stringify(result.rows[0]), { status: 200 }); // Return updated item
    } else {
      return new Response(JSON.stringify({ message: 'Item not found' }), { status: 404 });
    }
  } catch (error) {
    console.error('Error updating menu item:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  } finally {
    if (client) {
      client.release(); // Ensure the client is released
    }
  }
}
*/}
import supabase from '../../../../lib/subabaseclient'; // Adjust the import path according to your project structure

// Handle GET request to fetch a menu item by ID
export async function GET(req, { params }) {
    const { id } = params; // Extract ID from params

    // Parse ID to an integer
    const parsedId = parseInt(id, 10);

    // Check if parsedId is a valid number
    if (isNaN(parsedId)) {
        return new Response(JSON.stringify({ message: 'Invalid ID' }), { status: 400 });
    }

    console.log(`Received request for ID: ${parsedId}`);

    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('id', parsedId)
            .single(); // Use .single() to fetch a single item

        if (error) {
            if (error.code === 'PGRST116') { // Item not found error code
                return new Response(JSON.stringify({ message: 'Item not found' }), { status: 404 });
            }
            console.error('Error fetching menu item:', error);
            return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
        }

        console.log(`Query result for ID ${parsedId}:`, data);
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Error fetching menu item:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}

// Handle PUT request to update a menu item by ID
export async function PUT(req, { params }) {
    const { id } = params; // Extract ID from params
    const { user_id, dish_name, description, price, image_url } = await req.json(); // Get the request body

    // Parse ID to an integer
    const parsedId = parseInt(id, 10);

    // Validate request body
    if (!user_id || !dish_name || !description || price === undefined || !image_url) {
        return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
        return new Response(JSON.stringify({ message: 'Price must be a non-negative number' }), { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('menu_items')
            .update({
                user_id,
                dish_name,
                description,
                price: parsedPrice,
                image_url,
            })
            .eq('id', parsedId)
            .select('*') // Select the updated item
            .single(); // Get the updated item

        if (error) {
            if (error.code === 'PGRST116') { // Item not found error code
                return new Response(JSON.stringify({ message: 'Item not found' }), { status: 404 });
            }
            console.error('Error updating menu item:', error);
            return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
        }

        return new Response(JSON.stringify(data), { status: 200 }); // Return updated item
    } catch (error) {
        console.error('Error updating menu item:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
