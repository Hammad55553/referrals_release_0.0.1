import request from 'supertest';
import { expect as _expect } from 'chai';
import express, { json } from 'express';
import friendshipRoutes from '../src/routes/friendshipRoutes'; // Adjust path as needed

const app = express();
const expect = _expect;

// Middleware setup
app.use(json());
app.use('/api', friendshipRoutes);

describe('API Routes', () => {
    // Test Address CRUD
    describe('Address Routes', () => {
        it('should create a new address', async () => {
            const newAddress = {
                street: '123 Elm St',
                city: 'Springfield',
                state: 'IL',
                zip: '62704',
                country: 'USA'
            };

            const response = await request(app)
                .post('/api/addresses')
                .send(newAddress);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('_id');
            expect(response.body).to.have.property('street', '123 Elm St');
        });

        it('should update an address', async () => {
            const response = await request(app)
                .put('/api/addresses/60d5f2e84d32f9c9d8f0e1b2') // Replace with a valid ID
                .send({ city: 'Chicago' });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('city', 'Chicago');
        });

        it('should get all addresses', async () => {
            const response = await request(app).get('/api/addresses');

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('should get an address by ID', async () => {
            const response = await request(app)
                .get('/api/addresses/60d5f2e84d32f9c9d8f0e1b2'); // Replace with a valid ID

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('_id');
        });

        it('should delete an address', async () => {
            const response = await request(app)
                .delete('/api/addresses/60d5f2e84d32f9c9d8f0e1b2'); // Replace with a valid ID

            expect(response.status).to.equal(204);
        });
    });

    // Test Domain CRUD
    describe('Domain Routes', () => {
        it('should create a new domain', async () => {
            const newDomain = {
                name: 'example.com',
                registrar: 'Domain Registrar',
                expiration_date: '2025-12-31'
            };

            const response = await request(app)
                .post('/api/domains')
                .send(newDomain);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('_id');
            expect(response.body).to.have.property('name', 'example.com');
        });

        it('should update a domain', async () => {
            const response = await request(app)
                .put('/api/domains/60d5f2e84d32f9c9d8f0e1b3') // Replace with a valid ID
                .send({ name: 'new-example.com' });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('name', 'new-example.com');
        });

        it('should get all domains', async () => {
            const response = await request(app).get('/api/domains');

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('should get a domain by ID', async () => {
            const response = await request(app)
                .get('/api/domains/60d5f2e84d32f9c9d8f0e1b3'); // Replace with a valid ID

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('_id');
        });

        it('should delete a domain', async () => {
            const response = await request(app)
                .delete('/api/domains/60d5f2e84d32f9c9d8f0e1b3'); // Replace with a valid ID

            expect(response.status).to.equal(204);
        });
    });

    // Test Message CRUD
    describe('Message Routes', () => {
        it('should create a new message', async () => {
            const newMessage = {
                content: 'Hello, world!',
                sender: 'user1',
                receiver: 'user2',
                timestamp: new Date().toISOString()
            };

            const response = await request(app)
                .post('/api/messages')
                .send(newMessage);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('_id');
            expect(response.body).to.have.property('content', 'Hello, world!');
        });

        it('should update a message', async () => {
            const response = await request(app)
                .put('/api/messages/60d5f2e84d32f9c9d8f0e1b4') // Replace with a valid ID
                .send({ content: 'Updated message' });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('content', 'Updated message');
        });

        it('should get all messages', async () => {
            const response = await request(app).get('/api/messages');

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('should get a message by ID', async () => {
            const response = await request(app)
                .get('/api/messages/60d5f2e84d32f9c9d8f0e1b4'); // Replace with a valid ID

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('_id');
        });

        it('should delete a message', async () => {
            const response = await request(app)
                .delete('/api/messages/60d5f2e84d32f9c9d8f0e1b4'); // Replace with a valid ID

            expect(response.status).to.equal(204);
        });
    });

    // Test MessageRequest CRUD
    describe('MessageRequest Routes', () => {
        it('should create a new message request', async () => {
            const newMessageRequest = {
                user_id: 'user1',
                message_ids: ['message1', 'message2'],
                status: 'pending'
            };

            const response = await request(app)
                .post('/api/message-requests')
                .send(newMessageRequest);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('_id');
            expect(response.body).to.have.property('status', 'pending');
        });

        it('should update a message request', async () => {
            const response = await request(app)
                .put('/api/message-requests/60d5f2e84d32f9c9d8f0e1b5') // Replace with a valid ID
                .send({ status: 'approved' });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status', 'approved');
        });

        it('should get all message requests', async () => {
            const response = await request(app).get('/api/message-requests');

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('should get a message request by ID', async () => {
            const response = await request(app)
                .get('/api/message-requests/60d5f2e84d32f9c9d8f0e1b5'); // Replace with a valid ID

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('_id');
        });

        it('should delete a message request', async () => {
            const response = await request(app)
                .delete('/api/message-requests/60d5f2e84d32f9c9d8f0e1b5'); // Replace with a valid ID

            expect(response.status).to.equal(204);
        });
    });

    // Test PostInfo CRUD
    describe('PostInfo Routes', () => {
        it('should create a new post info', async () => {
            const newPostInfo = {
                title: 'New Post',
                content: 'This is a new post.',
                author: 'author1',
                date_published: new Date().toISOString()
            };

            const response = await request(app)
                .post('/api/post-infos')
                .send(newPostInfo);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('_id');
            expect(response.body).to.have.property('title', 'New Post');
        });

        it('should update a post info', async () => {
            const response = await request(app)
                .put('/api/post-infos/60d5f2e84d32f9c9d8f0e1b6') // Replace with a valid ID
                .send({ title: 'Updated Post' });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('title', 'Updated Post');
        });

        it('should get all post infos', async () => {
            const response = await request(app).get('/api/post-infos');

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('should get a post info by ID', async () => {
            const response = await request(app)
                .get('/api/post-infos/60d5f2e84d32f9c9d8f0e1b6'); // Replace with a valid ID

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('_id');
        });

        it('should delete a post info', async () => {
            const response = await request(app)
                .delete('/api/post-infos/60d5f2e84d32f9c9d8f0e1b6'); // Replace with a valid ID

            expect(response.status).to.equal(204);
        });
    });

    // Test QuickMessage CRUD
    describe('QuickMessage Routes', () => {
        it('should create a new quick message', async () => {
            const newQuickMessage = {
                content: 'Quick message content',
                sender: 'user1',
                timestamp: new Date().toISOString()
            };

            const response = await request(app)
                .post('/api/quick-messages')
                .send(newQuickMessage);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('_id');
            expect(response.body).to.have.property('content', 'Quick message content');
        });

        it('should update a quick message', async () => {
            const response = await request(app)
                .put('/api/quick-messages/60d5f2e84d32f9c9d8f0e1b7') // Replace with a valid ID
                .send({ content: 'Updated quick message' });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('content', 'Updated quick message');
        });

        it('should get all quick messages', async () => {
            const response = await request(app).get('/api/quick-messages');

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('should get a quick message by ID', async () => {
            const response = await request(app)
                .get('/api/quick-messages/60d5f2e84d32f9c9d8f0e1b7'); // Replace with a valid ID

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('_id');
        });

        it('should delete a quick message', async () => {
            const response = await request(app)
                .delete('/api/quick-messages/60d5f2e84d32f9c9d8f0e1b7'); // Replace with a valid ID

            expect(response.status).to.equal(204);
        });
    });

    // Test User CRUD
    describe('User Routes', () => {
        it('should create a new user', async () => {
            const newUser = {
                username: 'johndoe',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'user'
            };

            const response = await request(app)
                .post('/api/users')
                .send(newUser);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('_id');
            expect(response.body).to.have.property('username', 'johndoe');
        });

        it('should update a user', async () => {
            const response = await request(app)
                .put('/api/users/60d5f2e84d32f9c9d8f0e1b8') // Replace with a valid ID
                .send({ email: 'john.newemail@example.com' });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('email', 'john.newemail@example.com');
        });

        it('should get all users', async () => {
            const response = await request(app).get('/api/users');

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('should get a user by ID', async () => {
            const response = await request(app)
                .get('/api/users/60d5f2e84d32f9c9d8f0e1b8'); // Replace with a valid ID

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('_id');
        });

        it('should delete a user', async () => {
            const response = await request(app)
                .delete('/api/users/60d5f2e84d32f9c9d8f0e1b8'); // Replace with a valid ID

            expect(response.status).to.equal(204);
        });
    });

    // Test UserChatApp CRUD
    describe('UserChatApp Routes', () => {
        it('should create a new user chat app entry', async () => {
            const newUserChatApp = {
                user_id: 'user1',
                chat_app_name: 'ChatAppX',
                settings: { theme: 'dark' }
            };

            const response = await request(app)
                .post('/api/user-chat-apps')
                .send(newUserChatApp);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('_id');
            expect(response.body).to.have.property('chat_app_name', 'ChatAppX');
        });

        it('should update a user chat app entry', async () => {
            const response = await request(app)
                .put('/api/user-chat-apps/60d5f2e84d32f9c9d8f0e1b9') // Replace with a valid ID
                .send({ settings: { theme: 'light' } });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('settings').that.deep.equals({ theme: 'light' });
        });

        it('should get all user chat apps', async () => {
            const response = await request(app).get('/api/user-chat-apps');

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('should get a user chat app entry by ID', async () => {
            const response = await request(app)
                .get('/api/user-chat-apps/60d5f2e84d32f9c9d8f0e1b9'); // Replace with a valid ID

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('_id');
        });

        it('should delete a user chat app entry', async () => {
            const response = await request(app)
                .delete('/api/user-chat-apps/60d5f2e84d32f9c9d8f0e1b9'); // Replace with a valid ID

            expect(response.status).to.equal(204);
        });
    });

    // Test UserNotification CRUD
    describe('UserNotification Routes', () => {
        it('should create a new user notification', async () => {
            const newUserNotification = {
                user_id: 'user1',
                message: 'New notification',
                read: false
            };

            const response = await request(app)
                .post('/api/user-notifications')
                .send(newUserNotification);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('_id');
            expect(response.body).to.have.property('message', 'New notification');
        });

        it('should update a user notification', async () => {
            const response = await request(app)
                .put('/api/user-notifications/60d5f2e84d32f9c9d8f0e1ba') // Replace with a valid ID
                .send({ read: true });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('read', true);
        });

        it('should get all user notifications', async () => {
            const response = await request(app).get('/api/user-notifications');

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('should get a user notification by ID', async () => {
            const response = await request(app)
                .get('/api/user-notifications/60d5f2e84d32f9c9d8f0e1ba'); // Replace with a valid ID

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('_id');
        });

        it('should delete a user notification', async () => {
            const response = await request(app)
                .delete('/api/user-notifications/60d5f2e84d32f9c9d8f0e1ba'); // Replace with a valid ID

            expect(response.status).to.equal(204);
        });
    });
});
