const fs = require('fs')

class Delete{
    audio(file, minutes){
        try {
            if (fs.existsSync(file)) {
              let timer = setTimeout(() => {
                  fs.unlinkSync(file)
              }, 60000 * minutes)
            }
        } catch(err) {
            console.error(err)
        }
    }
}

module.exports = new Delete