export interface ActionState {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  allowResend?: boolean;
  email?: string;
}
