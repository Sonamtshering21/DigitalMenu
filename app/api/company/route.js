import pool from '../../../lib/db';
import { NextResponse } from 'next/server';
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
  
    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
  
    try {
      const result = await pool.query('SELECT * FROM company_info WHERE user_id = $1', [user_id]);
  
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 });
      }
  
      return NextResponse.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching company details:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }