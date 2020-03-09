const express = require('express');
const router = express.Router();
const { UserController, ChatController } = require('../src/Controller/v1/index');
const { userSignup } = require('../src/Request');
const { UserAuth, cross, Language } = require('../src/middleware/index');
const Apiresponse = require('../libary/ApiResponse');
const user = new UserController();

router.use([ cross, Language, UserAuth ]);
router.get('/', function(req, res) {
	res.send(' APi workings ');
});

router.post('/user', userSignup, Apiresponse(user.addUser));
router.get('/user-listing/:offset([0-9]+)?', Apiresponse(user.userListing));
router.post('/user/login/', Apiresponse(user.loginUser));
router.post('/user/verify', Apiresponse(user.verifyOtp));
router.post('/user/edit/', Apiresponse(user.updateProfile));
router.post('/change_password', Apiresponse(user.changePassword));
router.post('/forgot-password', Apiresponse(user.forgotPassword));
router.post('/logout', Apiresponse(user.logout));
router.get('/app-information', Apiresponse(user.appInfo));
router.post('/send-message', Apiresponse(ChatController.sendMessage));
router.get('/get-message', Apiresponse(ChatController.getMessage));
router.get('/last-chat', Apiresponse(ChatController.lastChat));
router.delete('/delete-thread', Apiresponse(ChatController.deleteChat));
router.delete('/delete-message', Apiresponse(ChatController.deletesingleMessage));

module.exports = router;