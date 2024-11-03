import { createClient } from '@supabase/supabase-js'
console.log("supabaseclient.js loaded");
const supabaseUrl = 'https://fuctyylyhyotkdljgazo.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1Y3R5eWx5aHlvdGtkbGpnYXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2MTA0NDIsImV4cCI6MjA0NjE4NjQ0Mn0.EGBccAyXf750AwvebOdlivY3x1-48mnLCpRWMQWK7K0"
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;
{/*
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;*/}