const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());


// Connect to Supabase
const supabaseUrl = 'https://fbedzeysshcgdwogaqvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZWR6ZXlzc2hjZ2R3b2dhcXZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjI0NTI5MSwiZXhwIjoyMDIxODIxMjkxfQ.SZNu0bcfB3eijL_1hadWAglCymI7XfmjorlCO39myrs';
const supabase = createClient(supabaseUrl, supabaseKey);


// API endpoint to save HTML code to Supabase
app.post('/save', async (req, res) => {
  try {
    const { code } = req.body;
    const { data, error } = await supabase.from('html_codes').insert([{ code }]);
    if (error) {
      throw error;
    }
    res.json({ success: true, message: 'HTML code saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
