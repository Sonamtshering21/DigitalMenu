{/*import pool from '../../../lib/db'; // Adjust the import path according to your project structure

export async function POST(request) {
    try {
        const newItem = await request.json(); // Expecting the new item data in the request body

        // Validate the input
        const { user_id, dish_name, description, price, image_url } = newItem;
        if (!user_id || !dish_name || !description || price === undefined || !image_url) {
            return new Response(JSON.stringify({ error: 'All fields are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Parse and validate price
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            return new Response(JSON.stringify({ error: 'Price must be a non-negative number' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const client = await pool.connect();
        
        // Insert the new menu item into the database
        const result = await client.query(
            'INSERT INTO menu_items (user_id, dish_name, description, price, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, dish_name, description, parsedPrice, image_url]
        );

        client.release();

        const addedItem = result.rows[0]; // Get the added item from the response

        return new Response(JSON.stringify(addedItem), {
            status: 201, // HTTP status code for created
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error adding menu item:', error);
        return new Response(JSON.stringify({ error: 'Error adding menu item' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    try {
        const client = await pool.connect();

        if (!userId) {
            return new Response(JSON.stringify({ error: 'User ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const result = await client.query('SELECT * FROM menu_items WHERE user_id = $1', [userId]);
        client.release();

        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return new Response(JSON.stringify({ error: 'Error fetching menu items' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');

    try {
        const client = await pool.connect();

        if (!itemId) {
            return new Response(JSON.stringify({ error: 'Item ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await client.query('DELETE FROM menu_items WHERE id = $1', [itemId]);
        client.release();

        return new Response(JSON.stringify({ message: 'Item deleted successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        return new Response(JSON.stringify({ error: 'Error deleting menu item' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
export async function PUT(request) {
    const items = await request.json(); // Expecting an array of menu items

    // Validate the input
    if (!Array.isArray(items) || items.length === 0) {
        return new Response(JSON.stringify({ error: 'At least one menu item is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Log the incoming items for debugging
    console.log("Received items for update:", items);

    const client = await pool.connect();
    try {
        const updateQueries = items.map(item => {
            const { id, user_id, dish_name, description, price, image_url } = item;

            // Validate each item
            if (!id || !user_id || !dish_name || !description || price === undefined || !image_url) {
                throw new Error('All fields are required for each item');
            }

            const parsedPrice = parseFloat(price);
            if (isNaN(parsedPrice) || parsedPrice < 0) {
                throw new Error('Price must be a non-negative number');
            }

            // Constructing the query for each item
            return client.query(
                'UPDATE menu_items SET user_id = $1, dish_name = $2, description = $3, price = $4, image_url = $5 WHERE id = $6 RETURNING *',
                [user_id, dish_name, description, parsedPrice, image_url, id]
            );
        });

        const results = await Promise.allSettled(updateQueries);

        // Check for any errors
        const updatedItems = results.map(result => {
            if (result.status === 'fulfilled') {
                return result.value.rows[0]; // Return updated item
            } else {
                return { error: result.reason.message }; // Handle the error
            }
        });

        return new Response(JSON.stringify(updatedItems), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error updating menu items:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        client.release(); // Ensure the client is released
    }
}
*/}

import supabase from '../../../lib/subabaseclient'; // Adjust the import path according to your project structure
export async function POST(request) {
    try {
        const newItem = await request.json(); // Expecting the new item data in the request body

        // Validate the input
        const { user_id, dish_name, description, price, image_url } = newItem;
        if (!user_id || !dish_name || !description || price === undefined || !image_url) {
            return new Response(JSON.stringify({ error: 'All fields are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Parse and validate price
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            return new Response(JSON.stringify({ error: 'Price must be a non-negative number' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Insert the new menu item into the database
        const { data, error } = await supabase
            .from('menu_items')
            .insert([{ 
                dish_name, 
                description, 
                price: parsedPrice, 
                image_url, 
                user_id 
            }])
            .select(); // This will return the inserted row(s)


        // Log the response for debugging
        
      
        if (error) {
            console.error('Error adding menu item:', error);
            return new Response(JSON.stringify({ error: 'Error adding menuuuuuuu item' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Check if data is null or empty
        if (!data || data.length === 0) {
            return new Response(JSON.stringify({ error: 'No item was added to the menu' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const addedItem = data[0]; // Get the added item from the response

        return new Response(JSON.stringify(addedItem), {
            status: 201, // HTTP status code for created
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error adding menu item:', error);
        return new Response(JSON.stringify({ error: 'Error adding menu item' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    try {
        if (!userId) {
            return new Response(JSON.stringify({ error: 'User ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching menu items:', error);
            return new Response(JSON.stringify({ error: 'Error fetching menu items' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return new Response(JSON.stringify({ error: 'Error fetching menu items' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');

    try {
        if (!itemId) {
            return new Response(JSON.stringify({ error: 'Item ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { error } = await supabase
            .from('menu_items')
            .delete()
            .eq('id', itemId);

        if (error) {
            console.error('Error deleting menu item:', error);
            return new Response(JSON.stringify({ error: 'Error deleting menu item' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ message: 'Item deleted successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        return new Response(JSON.stringify({ error: 'Error deleting menu item' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function PUT(request) {
    const items = await request.json(); // Expecting an array of menu items

    // Validate the input
    if (!Array.isArray(items) || items.length === 0) {
        return new Response(JSON.stringify({ error: 'At least one menu item is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Log the incoming items for debugging
    console.log("Received items for update:", items);

    try {
        const updateQueries = items.map(async item => {
            const { id, user_id, dish_name, description, price, image_url } = item;

            // Validate each item
            if (!id || !user_id || !dish_name || !description || price === undefined || !image_url) {
                throw new Error('All fields are required for each item');
            }

            const parsedPrice = parseFloat(price);
            if (isNaN(parsedPrice) || parsedPrice < 0) {
                throw new Error('Price must be a non-negative number');
            }

            // Constructing the query for each item
            const { data, error } = await supabase
                .from('menu_items')
                .update({ user_id, dish_name, description, price: parsedPrice, image_url })
                .eq('id', id);

            if (error) {
                throw new Error(`Error updating item with ID ${id}: ${error.message}`);
            }

            return data[0]; // Return updated item
        });

        const updatedItems = await Promise.allSettled(updateQueries);

        return new Response(JSON.stringify(updatedItems.map(result => {
            if (result.status === 'fulfilled') {
                return result.value; // Return updated item
            } else {
                return { error: result.reason.message }; // Handle the error
            }
        })), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error updating menu items:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
