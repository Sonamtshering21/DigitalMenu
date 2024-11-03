import { createClient } from '@supabase/supabase-js'
console.log("supabaseclient.js loaded");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL 
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
const supabase = createClient(supabaseUrl, supabaseAnonKey)



export default supabase;
{/*
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;*/}