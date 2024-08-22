const Address = require('../models/Address');
const Domain = require('../models/Domain');
const Message = require('../models/Message');
const MessageRequest = require('../models/MessageRequest');
const PostInfo = require('../models/PostInfo');
const QuickMessage = require('../models/QuickMessage');
const User = require('../models/User');
const UserChatApp = require('../models/UserChatApp');
const UserNotification = require('../models/UserNotification');

// Utility function for async route handlers
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Address Controller
exports.createAddress = asyncHandler(async (req, res) => {
    const address = new Address(req.body);
    await address.save();
    res.status(201).send(address);
});

exports.getAllAddresses = asyncHandler(async (req, res) => {
    const addresses = await Address.find();
    res.status(200).send(addresses);
});

exports.getAddressById = asyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);
    res.status(200).send(address);
});

exports.updateAddress = asyncHandler(async (req, res) => {
    const address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(address);
});

exports.deleteAddress = asyncHandler(async (req, res) => {
    await Address.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Domain Controller
exports.createDomain = asyncHandler(async (req, res) => {
    const domain = new Domain(req.body);
    await domain.save();
    res.status(201).send(domain);
});

exports.getAllDomains = asyncHandler(async (req, res) => {
    const domains = await Domain.find();
    res.status(200).send(domains);
});

exports.getDomainById = asyncHandler(async (req, res) => {
    const domain = await Domain.findById(req.params.id);
    res.status(200).send(domain);
});

exports.updateDomain = asyncHandler(async (req, res) => {
    const domain = await Domain.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(domain);
});

exports.deleteDomain = asyncHandler(async (req, res) => {
    await Domain.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Message Controller
exports.createMessage = asyncHandler(async (req, res) => {
    const message = new Message(req.body);
    await message.save();
    res.status(201).send(message);
});

exports.getAllMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find();
    res.status(200).send(messages);
});

exports.getMessageById = asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);
    res.status(200).send(message);
});

exports.updateMessage = asyncHandler(async (req, res) => {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(message);
});

exports.deleteMessage = asyncHandler(async (req, res) => {
    await Message.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// MessageRequest Controller
exports.createMessageRequest = asyncHandler(async (req, res) => {
    const messageRequest = new MessageRequest(req.body);
    await messageRequest.save();
    res.status(201).send(messageRequest);
});

exports.getAllMessageRequests = asyncHandler(async (req, res) => {
    const messageRequests = await MessageRequest.find().populate('messages');
    res.status(200).send(messageRequests);
});

exports.getMessageRequestById = asyncHandler(async (req, res) => {
    const messageRequest = await MessageRequest.findById(req.params.id).populate('messages');
    res.status(200).send(messageRequest);
});

exports.updateMessageRequest = asyncHandler(async (req, res) => {
    const messageRequest = await MessageRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(messageRequest);
});

exports.deleteMessageRequest = asyncHandler(async (req, res) => {
    await MessageRequest.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// PostInfo Controller
exports.createPostInfo = asyncHandler(async (req, res) => {
    const postInfo = new PostInfo(req.body);
    await postInfo.save();
    res.status(201).send(postInfo);
});

exports.getAllPostInfos = asyncHandler(async (req, res) => {
    const postInfos = await PostInfo.find();
    res.status(200).send(postInfos);
});

exports.getPostInfoById = asyncHandler(async (req, res) => {
    const postInfo = await PostInfo.findById(req.params.id);
    res.status(200).send(postInfo);
});

exports.updatePostInfo = asyncHandler(async (req, res) => {
    const postInfo = await PostInfo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(postInfo);
});

exports.deletePostInfo = asyncHandler(async (req, res) => {
    await PostInfo.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// QuickMessage Controller
exports.createQuickMessage = asyncHandler(async (req, res) => {
    const quickMessage = new QuickMessage(req.body);
    await quickMessage.save();
    res.status(201).send(quickMessage);
});

exports.getAllQuickMessages = asyncHandler(async (req, res) => {
    const quickMessages = await QuickMessage.find();
    res.status(200).send(quickMessages);
});

exports.getQuickMessageById = asyncHandler(async (req, res) => {
    const quickMessage = await QuickMessage.findById(req.params.id);
    res.status(200).send(quickMessage);
});

exports.updateQuickMessage = asyncHandler(async (req, res) => {
    const quickMessage = await QuickMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(quickMessage);
});

exports.deleteQuickMessage = asyncHandler(async (req, res) => {
    await QuickMessage.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// User Controller
exports.createUser = asyncHandler(async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
});

exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).send(users);
});

exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
});

exports.updateUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(user);
});

exports.deleteUser = asyncHandler(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// UserChatApp Controller
exports.createUserChatApp = asyncHandler(async (req, res) => {
    const userChatApp = new UserChatApp(req.body);
    await userChatApp.save();
    res.status(201).send(userChatApp);
});

exports.getAllUserChatApps = asyncHandler(async (req, res) => {
    const userChatApps = await UserChatApp.find();
    res.status(200).send(userChatApps);
});

exports.getUserChatAppById = asyncHandler(async (req, res) => {
    const userChatApp = await UserChatApp.findById(req.params.id);
    res.status(200).send(userChatApp);
});

exports.updateUserChatApp = asyncHandler(async (req, res) => {
    const userChatApp = await UserChatApp.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(userChatApp);
});

exports.deleteUserChatApp = asyncHandler(async (req, res) => {
    await UserChatApp.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// UserNotification Controller
exports.createUserNotification = asyncHandler(async (req, res) => {
    const userNotification = new UserNotification(req.body);
    await userNotification.save();
    res.status(201).send(userNotification);
});

exports.getAllUserNotifications = asyncHandler(async (req, res) => {
    const userNotifications = await UserNotification.find();
    res.status(200).send(userNotifications);
});

exports.getUserNotificationById = asyncHandler(async (req, res) => {
    const userNotification = await UserNotification.findById(req.params.id);
    res.status(200).send(userNotification);
});

exports.updateUserNotification = asyncHandler(async (req, res) => {
    const userNotification = await UserNotification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(userNotification);
});

exports.deleteUserNotification = asyncHandler(async (req, res) => {
    await UserNotification.findByIdAndDelete(req.params.id);
    res.status(204).send();
});
