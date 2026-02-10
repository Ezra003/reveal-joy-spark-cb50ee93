// src/lib/validation.ts
import { z } from 'zod';

export const babyNameSchema = z.string()
  .max(50, 'Baby name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]*$/, 'Baby name can only contain letters, spaces, hyphens, and apostrophes')
  .optional()
  .or(z.literal(''))
  .transform(val => val?.trim());

export const dueDateSchema = z.string()
  .max(100, 'Due date must be less than 100 characters')
  .regex(/^[a-zA-Z0-9\s,.-]*$/, 'Invalid due date format')
  .optional()
  .or(z.literal(''))
  .transform(val => val?.trim());

export const guestNameSchema = z.string()
  .min(1, 'Name is required')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]*$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .transform(val => val.trim());
