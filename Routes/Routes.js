const express  =require('express')
const router = express.Router()
const MyControllers =  require('../Controllers/Controllers')
const upload = require('../multer_uploader/uploadFiles')


// router.get('/' , MyControllers.regForm )
router.post('/user' , MyControllers.getForm)

router.post('/result' , MyControllers.showResult)
router.post('/user-register' , MyControllers.register)
router.post('/user-login' , MyControllers.login)

router.get('/get-all-users' , MyControllers.ValidateToken, MyControllers.getAllUsers)
router.post('/update-user-email' , MyControllers.updateUserEmail )
router.post('/change-password' , MyControllers.changePassword )

router.post('/delete-user' , MyControllers.deleteUser )
router.post('/dummyLogin' , MyControllers.dummyLogin)
router.post('/checkOE' , MyControllers.ValidateToken, MyControllers.checkOddEven)
router.post('/upload-images' , MyControllers.uploadFile)

router.post("/upload-images" , upload.array("files") , MyControllers.uploadFile)

router.post('/reset-password-by-otp' , MyControllers.resetPasswordByOtp )
router.post('/verify-otp' , MyControllers.verifyOtp )

module.exports = router