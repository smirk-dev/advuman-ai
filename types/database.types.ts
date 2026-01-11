export interface User {
  id: string;
  email: string;
  full_name: string | null;
  business_type: string | null;
  industry: string | null;
  subscription_tier: 'free' | 'professional';
  subscription_status: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  conversations_this_month: number;
  billing_period_start: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  user_id: string;
  business_name: string | null;
  business_stage: 'idea' | 'mvp' | 'growth' | 'scale' | null;
  monthly_revenue: string | null;
  team_size: number | null;
  primary_goal: string | null;
  challenges: string[] | null;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'user_id'>>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Conversation, 'id' | 'user_id' | 'created_at'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'>;
        Update: Partial<Omit<Message, 'id' | 'conversation_id' | 'created_at'>>;
      };
    };
  };
}
