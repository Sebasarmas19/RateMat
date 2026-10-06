export const environment = {
  production: true,
  supabaseUrl: 'https://ckqonhzywynbdhscdrsf.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrcW9uaHp5d3luYmRoc2NkcnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNTMwMjAsImV4cCI6MjEwNDgyOTAyMH0.pIPoZ82bBHiWAE5d1i4Iw7Zhpr7L3KlPddlyqqQcqH8',
  apiUrl: typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? `http://${window.location.hostname}:3001`
    : 'http://localhost:3001'
};
