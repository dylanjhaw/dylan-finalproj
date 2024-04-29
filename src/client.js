import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mtfhbhnxrkoxizodyfkq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10ZmhiaG54cmtveGl6b2R5ZmtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQzMzA4OTgsImV4cCI6MjAyOTkwNjg5OH0.jXThiwl2W8X39LPQ-Mu-u9TByJzGceBBkIrUxo0Mftc'
export const supabase = createClient(supabaseUrl, supabaseKey)