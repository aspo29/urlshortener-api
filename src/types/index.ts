export interface User {
  id: number;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface URL {
  id: string;
  url: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Visit {
  id: number;
  url_id: string;
  ip: string;
  created_at: Date;
  updated_at: Date;
}

export interface RateLimit {
  user_id: number;
  count: number;
  reset_at: Date;
  created_at: Date;
  updated_at: Date;
}

declare module "knex/types/tables" {
  interface Tables {
    users: User;
    urls: URL;
    visits: Visit;
    rate_limits: RateLimit;
  }
}
