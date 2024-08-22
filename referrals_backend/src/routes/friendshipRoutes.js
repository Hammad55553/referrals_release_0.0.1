const express = require('express');
const router = express.Router();
const controllers = require('../controllers/friendshipControllers');

// Address Routes
router.post('/addresses', controllers.createAddress);
router.get('/addresses', controllers.getAllAddresses);
router.get('/addresses/:id', controllers.getAddressById);
router.put('/addresses/:id', controllers.updateAddress);
router.delete('/addresses/:id', controllers.deleteAddress);

// Domain Routes
router.post('/domains', controllers.createDomain);
router.get('/domains', controllers.getAllDomains);
router.get('/domains/:id', controllers.getDomainById);
router.put('/domains/:id', controllers.updateDomain);
router.delete('/domains/:id', controllers.deleteDomain);

// Message Routes
router.post('/messages', controllers.createMessage);
router.get('/messages', controllers.getAllMessages);
router.get('/messages/:id', controllers.getMessageById);
router.put('/messages/:id', controllers.updateMessage);
router.delete('/messages/:id', controllers.deleteMessage);

// MessageRequest Routes
router.post('/message-requests', controllers.createMessageRequest);
router.get('/message-requests', controllers.getAllMessageRequests);
router.get('/message-requests/:id', controllers.getMessageRequestById);
router.put('/message-requests/:id', controllers.updateMessageRequest);
router.delete('/message-requests/:id', controllers.deleteMessageRequest);

// PostInfo Routes
router.post('/post-infos', controllers.createPostInfo);
router.get('/post-infos', controllers.getAllPostInfos);
router.get('/post-infos/:id', controllers.getPostInfoById);
router.put('/post-infos/:id', controllers.updatePostInfo);
router.delete('/post-infos/:id', controllers.deletePostInfo);

// QuickMessage Routes
router.post('/quick-messages', controllers.createQuickMessage);
router.get('/quick-messages', controllers.getAllQuickMessages);
router.get('/quick-messages/:id', controllers.getQuickMessageById);
router.put('/quick-messages/:id', controllers.updateQuickMessage);
router.delete('/quick-messages/:id', controllers.deleteQuickMessage);

// User Routes
router.post('/users', controllers.createUser);
router.get('/users', controllers.getAllUsers);
router.get('/users/:id', controllers.getUserById);
router.put('/users/:id', controllers.updateUser);
router.delete('/users/:id', controllers.deleteUser);

// UserChatApp Routes
router.post('/user-chat-apps', controllers.createUserChatApp);
router.get('/user-chat-apps', controllers.getAllUserChatApps);
router.get('/user-chat-apps/:id', controllers.getUserChatAppById);
router.put('/user-chat-apps/:id', controllers.updateUserChatApp);
router.delete('/user-chat-apps/:id', controllers.deleteUserChatApp);

// UserNotification Routes
router.post('/user-notifications', controllers.createUserNotification);
router.get('/user-notifications', controllers.getAllUserNotifications);
router.get('/user-notifications/:id', controllers.getUserNotificationById);
router.put('/user-notifications/:id', controllers.updateUserNotification);
router.delete('/user-notifications/:id', controllers.deleteUserNotification);

module.exports = router;
