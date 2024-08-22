const app = require('./app');
const connectDB = require('./src/config/db');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;

// Connect to the Database
connectDB();

// Listening to the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});