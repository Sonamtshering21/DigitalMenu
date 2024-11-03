
import supabase from '../../../lib/subabaseclient'
import { NextResponse } from 'next/server';
    
export async function GET(request) {
      const { searchParams } = new URL(request.url);
      const user_id = searchParams.get('user_id');
    
      if (!user_id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
      }
    
      try {
        // Use Supabase to fetch company info for the given user_id
        const { data, error } = await supabase
          .from('company_info')
          .select('*')
          .eq('user_id', user_id)
          .single(); // Use .single() to get a single record
    
        if (error) {
          console.error('Error fetching company details:', error);
          return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    
        if (!data) {
          return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }
    
        return NextResponse.json(data);
      } catch (error) {
        console.error('Unexpected error fetching company details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
    }
    