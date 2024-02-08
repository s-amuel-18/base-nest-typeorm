export interface CreateCodeVerification {
  code: string;
  expireAt: Date;
  userId: number;
  isVerified: boolean;
}
