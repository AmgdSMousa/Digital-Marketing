export enum View {
  ContentIdeas = 'Content Ideas',
  SocialMediaPost = 'Social Media Post',
  EmailCampaign = 'Email Campaign',
  AdCopy = 'Ad Copy',
  ImageGeneration = 'Image Generation',
  History = 'History',
  Clients = 'Clients',
  Analytics = 'Analytics Dashboard',
  Settings = 'Settings',
  Login = 'Login',
  UserManagement = 'User Management',
}

export interface EmailCampaign {
  subject: string;
  body: string;
}

export interface AdCopy {
  headline: string;
  description: string;
}

export type GenerationResult = string | string[] | EmailCampaign | AdCopy;

export interface HistoryItem {
  id: string;
  view: View;
  input: any;
  output: GenerationResult;
  timestamp: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  notes: string;
}

export interface SmtpSettings {
  server: string;
  port: string;
  username: string;
  password: string;
  fromEmail: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'User';
}
