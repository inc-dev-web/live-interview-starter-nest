import { INestApplication } from '@nestjs/common';
import { describe, beforeEach, it, expect, afterEach } from 'vitest';
import { createTestApp } from './utils/app';
import { startTestAppServer, TestRequestInstance } from './utils/server';

type User = {
  id: string;
  username: string;
  friends?: User[];
};

const createUser = async (request: TestRequestInstance, userData: { username: string }): Promise<User> => {
  const response = await request.anonymus.post('/users', userData);
  expect(response.status).toBe(201);
  return response.data;
};

const UUID_V4_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

describe('Users API (e2e)', () => {
  let app: INestApplication;
  let request: TestRequestInstance;

  beforeEach(async () => {
    app = await createTestApp();
    request = await startTestAppServer(app);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('should create a new user with a valid UUID v4 id', async () => {
      const userData = { username: 'testuser-uuid' };
      const response = await request.anonymus.post('/users', userData);

      expect(response.status).toBe(201);
      expect(response.data.username).toBe(userData.username);
      expect(response.data.id).toMatch(UUID_V4_REGEX);
    });

    it('should respond with 409 Conflict when creating a user with a duplicate username', async () => {
      const userData = { username: 'duplicate-user' };
      await createUser(request, userData);

      const duplicateResponse = await request.anonymus.post('/users', userData);
      expect(duplicateResponse.status).toBe(409);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete an existing user successfully', async () => {
      const user = await createUser(request, { username: 'toBeDeleted' });

      const deleteResponse = await request.anonymus.delete(`/users/${user.id}`);
      expect(deleteResponse.status).toBe(204);

      const getResponse = await request.anonymus.get(`/users/${user.id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should respond with 404 when trying to delete a non-existent user', async () => {
      const nonExistentId = '11111111-2222-3333-4444-555555555555';
      const response = await request.anonymus.delete(`/users/${nonExistentId}`);
      expect(response.status).toBe(404);
    });

    it('should be removed from other users friends lists when deleted', async () => {
      // Setup: Create three users
      const userA = await createUser(request, { username: 'userA' });
      const userB = await createUser(request, { username: 'userB' });
      const userToDelete = await createUser(request, { username: 'userToDelete' });
    
      // Add the userToDelete as a friend to userA and userB
      await request.anonymus.post(`/users/${userA.id}/friends/${userToDelete.id}`);
      await request.anonymus.post(`/users/${userB.id}/friends/${userToDelete.id}`);
    
      // Action: Delete the user
      await request.anonymus.delete(`/users/${userToDelete.id}`);
    
      // Verification: Check if the deleted user is removed from friends lists
      const userAResponse = await request.anonymus.get(`/users/${userA.id}`);
      expect(userAResponse.status).toBe(200);
      expect(userAResponse.data.friends).not.toContain(
        expect.objectContaining({ id: userToDelete.id }),
      );
    
      const userBResponse = await request.anonymus.get(`/users/${userB.id}`);
      expect(userBResponse.status).toBe(200);
      expect(userBResponse.data.friends).not.toContain(
        expect.objectContaining({ id: userToDelete.id }),
      );
    });
  });

  describe('Friend Management', () => {
    let userA: User;
    let userB: User;
    const nonExistentUserId = '11111111-2222-3333-4444-555555555555';

    beforeEach(async () => {
      userA = await createUser(request, { username: 'userA' });
      userB = await createUser(request, { username: 'userB' });
    });

    describe('POST /users/:userId/friends/:friendId', () => {
      it('should add an existing user as a friend', async () => {
        const response = await request.anonymus.post(`/users/${userA.id}/friends/${userB.id}`);
        expect(response.status).toBe(201);
      });

      it('should throw 404 if the user to add a friend to does not exist', async () => {
        const response = await request.anonymus.post(`/users/${nonExistentUserId}/friends/${userB.id}`);
        expect(response.status).toBe(404);
      });

      it('should throw 404 if the user to be added as a friend does not exist', async () => {
        const response = await request.anonymus.post(`/users/${userA.id}/friends/${nonExistentUserId}`);
        expect(response.status).toBe(404);
      });
    });

    describe('DELETE /users/:userId/friends/:friendId', () => {
      beforeEach(async () => {
        await request.anonymus.post(`/users/${userA.id}/friends/${userB.id}`);
      });

      it('should remove a friend from a user', async () => {
        const response = await request.anonymus.delete(`/users/${userA.id}/friends/${userB.id}`);
        expect(response.status).toBe(204);
      });

      it('should throw 400 if trying to remove a user who is not a friend', async () => {
        await request.anonymus.delete(`/users/${userA.id}/friends/${userB.id}`);
        const response = await request.anonymus.delete(`/users/${userA.id}/friends/${userB.id}`);
        expect(response.status).toBe(400);
      });

      it('should throw 404 if the user to remove a friend from does not exist', async () => {
        const response = await request.anonymus.delete(`/users/${nonExistentUserId}/friends/${userB.id}`);
        expect(response.status).toBe(404);
      });
    });
  });
});