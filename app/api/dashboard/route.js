{/*import pool from '../../../lib/db'; // Adjust the import path according to your project structure

export async function POST(req) {
    try {
        // Parse the incoming request body
        const { companyName, address, contactInfo, description, socialLinks, userId } = await req.json();

        // Validate incoming data
        if (!companyName || !address || !contactInfo || !description || !userId) {
            return new Response(JSON.stringify({ message: 'All fields are required.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const client = await pool.connect(); // Connect to the PostgreSQL client
        // Insert data into the company_info table
        const result = await client.query(
            'INSERT INTO company_info (company_name, address, contact_info, description, social_links, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [companyName, address, contactInfo, description, socialLinks, userId]
        );

        const companyId = result.rows[0].id;

        client.release(); // Release the client back to the pool

        // Return the success response
        return new Response(JSON.stringify({ message: 'Company created successfully!', companyId }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error saving data to the database:', error);
        return new Response(JSON.stringify({ message: 'Error saving data to the database.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}*/}

import supabase from '../../../lib/subabaseclient'; // Adjust the import path according to your project structure 

export async function POST(req) {
    try {
        // Parse the incoming request body
        const { companyName, address, contactInfo, description, socialLinks, userId } = await req.json();

        // Validate incoming data
        if (!companyName || !address || !contactInfo || !description || !userId) {
            return new Response(JSON.stringify({ message: 'All fields are required.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Insert data into the company_info table using Supabase
        const { data, error } = await supabase
            .from('company_info')
            .insert([
                {
                    company_name: companyName,
                    address: address,
                    contact_info: contactInfo,
                    description: description,
                    social_links: socialLinks,
                    user_id: userId
                }
            ])
            .select('id') // Select the id of the newly created company
            .single(); // Since we expect one result back

        if (error) {
            console.error('Error saving data to the database:', error);
            return new Response(JSON.stringify({ message: 'Error saving data to the database.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const companyId = data.id;

        // Return the success response
        return new Response(JSON.stringify({ message: 'Company created successfully!', companyId }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return new Response(JSON.stringify({ message: 'An unexpected error occurred.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
