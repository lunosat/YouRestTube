const Status = require('../models/status')

module.exports = app => {
    app.get('/status', async (req, res) => {
        let apiKey = req.query.apiKey
        Status.status(res, apiKey)
    })
}