export type ExchangeClientTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  scrope: string;
};

export type CreateKeycloakUserRequest = {
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled?: boolean;
  emailVerified?: boolean;
};

export type ExchangeUserTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  scrope: string;
  session_state: string;
  'not-before-policy': number;
};
