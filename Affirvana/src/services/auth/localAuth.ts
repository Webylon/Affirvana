interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
}

interface AuthResponse {
  user: User | null;
  error?: string;
}

const USERS_KEY = 'local_users';
const CURRENT_USER_KEY = 'current_user';

export const getCurrentUser = (): User | null => {
  try {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

const initializeUsers = () => {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    const defaultUsers = [
      {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        balance: 2500000,
        password: 'password123'
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
};

// Initialize demo users on module load
initializeUsers();

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  const usersJson = localStorage.getItem(USERS_KEY);
  const users = usersJson ? JSON.parse(usersJson) : [];
  
  const user = users.find((u: any) => 
    u.email === email && u.password === password
  );

  if (user) {
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return { user: userWithoutPassword };
  }

  return { user: null, error: 'Invalid email or password' };
};

export const signUp = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  const usersJson = localStorage.getItem(USERS_KEY);
  const users = usersJson ? JSON.parse(usersJson) : [];
  
  const existingUser = users.find((u: any) => u.email === email);
  if (existingUser) {
    return { user: null, error: 'Email already exists' };
  }

  const newUser = {
    id: crypto.randomUUID(),
    email,
    password,
    name,
    balance: 2500000
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const { password: _, ...userWithoutPassword } = newUser;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
  
  return { user: userWithoutPassword };
};

export const signOut = async (): Promise<void> => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem('favorites');
  localStorage.removeItem('cart');
  localStorage.removeItem('board');
};