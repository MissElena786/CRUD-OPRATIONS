const multer = require('multer')

var storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null , 'uploads')
    },
    filename  : function(req,file , cb){
        req['file_name'] =  file.originalname
        if(file.mimetype.split('/')[1] !== 'png')
        {
            return cb(new Error("Only PNG files are allowed"))
        }
        else
        {

            cb(null , file.originalname)
        }
    }
})

const upload = multer({storage : storage})






module.exports =  upload