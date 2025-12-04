export const users = [
  {
    id: '1',
    email: 'admin@syndexpress.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: '2',
    email: 'syndic@gmail.com',
    password: 'syndic123',
    role: 'syndic',
    name: 'Syndic Manager'
  },
  {
    id: '3',
    email: 'ahmed@gmail.com',
    password: 'resident123',
    role: 'resident',
    name: 'ahmed Resident'
  }
];

export function login(email, password) {
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return { success: true, user: userData };
  }

  return { success: false, message: 'Invalid email or password' };
}

export function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = '/login.html';
}

export function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}

export function hasRole(...roles) {
  const user = getCurrentUser();
  return user && roles.includes(user.role);
}

export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

export function requireRole(...roles) {
  if (!requireAuth()) return false;

  if (!hasRole(...roles)) {
    window.location.href = '/pages/dashboard.html';
    return false;
  }
  return true;
}
