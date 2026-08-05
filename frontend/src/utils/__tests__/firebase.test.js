import { ERROR_CAUSES, ERROR_CODES } from '$/constants/error';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  addDoc: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signOut: vi.fn(),
}));

describe('logInWithEmailAndPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws a friendly error when the credential is invalid', async () => {
    const { logInWithEmailAndPassword } = await import('../firebase.js');

    const firebaseError = Object.assign(new Error('Firebase: Error'), {
      code: ERROR_CODES.AUTH_INVALID_CREDENTIAL,
    });
    signInWithEmailAndPassword.mockRejectedValue(firebaseError);

    await expect(
      logInWithEmailAndPassword('test@example.com', 'wrong-password'),
    ).rejects.toMatchObject({
      message: 'Email or password is invalid. Please try again.',
      cause: ERROR_CAUSES.SIGN_IN_WITH_EMAIL,
    });
  });
});

describe('signInWithPopup', () => {
  const mockAuth = {};
  const mockProvider = {};

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves with the authenticated user', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    signInWithPopup.mockResolvedValue({ user: mockUser });

    const res = await signInWithPopup(mockAuth, mockProvider);

    expect(signInWithPopup).toHaveBeenCalledTimes(1);
    expect(signInWithPopup).toHaveBeenCalledWith(mockAuth, mockProvider);
    expect(res.user).toEqual(mockUser);
  });
});
