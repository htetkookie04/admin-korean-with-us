// Admin credentials configuration
// In production, these should be stored securely in environment variables
// and validated against a backend API

export const ADMIN_CREDENTIALS = [
  {
    email: 'admin@koreanwithus.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'Admin',
  },
  {
    email: 'teacher@koreanwithus.com',
    password: 'teacher123',
    name: 'Teacher User',
    role: 'Teacher',
  },
  {
    email: 'student@koreanwithus.com',
    password: 'student123',
    name: 'Student User',
    role: 'Student',
  },
];

export function validateCredentials(email: string, password: string) {
  const user = ADMIN_CREDENTIALS.find(
    (cred) => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
  );
  
  if (user) {
    return {
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
  
  return {
    success: false,
    error: 'Invalid email or password',
  };
}

