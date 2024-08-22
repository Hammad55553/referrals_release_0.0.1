import request from 'supertest';
import { expect as _expect } from 'chai';
import express, { json } from 'express';
import userProfileRoutes from '../src/routes/userProfileRoutes';

const app = express();
const expect = _expect;


// Middleware setup
app.use(json());
app.use('/api', userProfileRoutes);

describe('User Profile API Routes', () => {
  
  it('should create a new profile', async () => {
    const newProfile = {
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      headline: 'Software Engineer',
      about: 'Experienced developer with a passion for coding.',
      age: 30,
      years_of_exp: 5,
      phone_number: '123-456-7890',
      country: 'USA',
      city: 'San Francisco',
      education_id: '60f5f9f1b5a8e93f5b439e1f', // Mock ID
      github_url: 'https://github.com/johndoe',
      portfolio_url: 'https://johndoe.dev',
      linkedin_url: 'https://linkedin.com/in/johndoe',
      resume_url: 'https://johndoe.dev/resume.pdf',
      other_url: 'https://johndoe.dev/other',
      skills: ['JavaScript', 'Node.js', 'React'],
      visibility: 'both'
    };

    const response = await request(app)
      .post('/api/profiles')
      .send(newProfile);
      
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('full_name', 'John Doe');
    expect(response.body).toHaveProperty('email', 'john.doe@example.com');
    expect(response.body).toHaveProperty('visibility', 'both');
  });

  it('should update user profile', async () => {
    const response = await request(app)
      .put('/api/profile')
      .send({ name: 'John Doe', email: 'john@example.com' });
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Profile updated successfully');
  });

  it('should get user profile details', async () => {
    const response = await request(app)
      .get('/api/profile');
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
  });

  it('should update visibility status', async () => {
    const response = await request(app)
      .put('/api/profile/visibility')
      .send({ visibility: 'public' });
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Visibility status updated successfully');
  });

  it('should get visibility status', async () => {
    const response = await request(app)
      .get('/api/profile/visibility');
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('visibility');
  });

  it('should get profiles by criteria', async () => {
    const response = await request(app)
      .get('/api/profiles')
      .query({ experience: '5 years', skills: 'JavaScript' });
      
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get profile by ID', async () => {
    const profileId = '1234567890'; // Replace with an actual ID or mock ID
    const response = await request(app)
      .get(`/api/profile/${profileId}`);
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', profileId);
  });

  it('should discard a profile', async () => {
    const profileId = '1234567890'; // Replace with an actual ID or mock ID
    const response = await request(app)
      .post(`/api/profile/${profileId}/discard`);
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Profile discarded successfully');
  });
});
