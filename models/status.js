const fs = require('fs')

class Status {
    status(res, apiKey){
        const allowadedKey = process.env.AAP
        if(allowadedKey !== apiKey){
            let response = {
                error: "unauthorized apiKey",
            }
            res.status(400).json(response)
            return 
        }

        const uptimeF = async () => {
            let d = Math.round(process.uptime())
            let h = Math.floor(d / 3600)
            let m = Math.floor(d % 3600 / 60)
            let s = Math.floor(d % 3600 % 60)

            let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""
            let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : ""
            let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""

            return hDisplay + mDisplay + sDisplay;
        }
        const verifyAll = async () => {
            let uptime = await uptimeF()
            let response = {
                uptime: uptime,
                requests: 'TODO'
            }
            res.status(200).json(response)
        }

        verifyAll()
    }
}

module.exports = new Status