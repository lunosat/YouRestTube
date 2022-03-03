const customExpress = require('./config/customExpress')
const dotenv = require('dotenv')

dotenv.config()

const app = customExpress()

app.listen(3000, () => console.log('Server running on port 3000'))