
{/*import pool from '../../../lib/db'; // Adjust the import path according to your project structure

export async function GET() {
    try {
        const client = await pool.connect();
        client.release(); // Release the client back to the pool
        return new Response(JSON.stringify({ message: 'Connected to PostgreSQL database successfully!' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error connecting to PostgreSQL database:', error);
        return new Response(JSON.stringify({ error: 'Error connecting to PostgreSQL database' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}*/}

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Your Supabase URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Your Supabase Anon Key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
    try {
        // Check connection by fetching a simple query
        const { data, error } = await supabase.from('menu_items').select('*').limit(1);

        if (error) throw error; // If there's an error, throw it

        return new Response(JSON.stringify({ message: 'Connected to Supabase successfully!', data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error connecting to Supabase:', error);
        return new Response(JSON.stringify({ error: 'Error connecting to Supabase' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
