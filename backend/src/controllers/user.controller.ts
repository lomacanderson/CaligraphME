import { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';

export class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      // TODO: Implement create user
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      // TODO: Implement get user by ID
      const user = await UserService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: 'User not found' });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      // TODO: Implement update user
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  }

  static async getUserProgress(req: Request, res: Response) {
    try {
      // TODO: Implement get user progress
      const progress = await UserService.getUserProgress(req.params.id);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch progress' });
    }
  }

  static async getUserPreferences(req: Request, res: Response) {
    try {
      // TODO: Implement get user preferences
      const preferences = await UserService.getUserPreferences(req.params.id);
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch preferences' });
    }
  }

  static async updateUserPreferences(req: Request, res: Response) {
    try {
      // TODO: Implement update user preferences
      const preferences = await UserService.updateUserPreferences(req.params.id, req.body);
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  }
}

