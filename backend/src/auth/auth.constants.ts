// This file contains constants related to authentication, such as the JWT secret key.
// In a production environment, the secret should be stored securely and not hardcoded in the source code.
export const jwtConstants = {
  secret:
    process.env.NODE_ENV === 'production'
      ? process.env.JWT_SECRET ||
        (() => {
          throw new Error('JWT_SECRET must be set in production');
        })()
      : process.env.JWT_SECRET || 'dev-only-jwt-secret-do-not-use-in-production',
};
