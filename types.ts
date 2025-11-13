// Fix: Import `ComponentType` from react to resolve the 'React' namespace error.
import type { ComponentType } from 'react';

export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  role: Role;
  content: string;
}

export enum AppMode {
  GENERAL = 'General',
  PLANNER = 'Planner',
  CODER = 'Coder',
  WRITER = 'Writer',
}

export interface ModeConfig {
  // Fix: Use `ComponentType` instead of `React.ComponentType`.
  icon: ComponentType<{ className?: string }>;
  systemInstruction: string;
  placeholder: string;
}
