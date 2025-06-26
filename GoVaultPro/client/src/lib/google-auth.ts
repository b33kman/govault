// Google OAuth configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private gapi: any = null;
  private auth2: any = null;

  static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.gapi) {
        resolve();
        return;
      }

      // Load Google API script
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('auth2', () => {
          this.gapi = window.gapi;
          this.gapi.auth2.init({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/gmail.send profile email'
          }).then(() => {
            this.auth2 = this.gapi.auth2.getAuthInstance();
            resolve();
          }).catch(reject);
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async signIn(): Promise<GoogleUser> {
    if (!this.auth2) {
      await this.initialize();
    }

    const googleUser = await this.auth2.signIn();
    const profile = googleUser.getBasicProfile();
    
    return {
      id: profile.getId(),
      email: profile.getEmail(),
      name: profile.getName(),
      picture: profile.getImageUrl(),
    };
  }

  async signOut(): Promise<void> {
    if (this.auth2) {
      await this.auth2.signOut();
    }
  }

  getAccessToken(): string | null {
    if (!this.auth2) return null;
    
    const user = this.auth2.currentUser.get();
    if (user.isSignedIn()) {
      return user.getAuthResponse().access_token;
    }
    return null;
  }

  isSignedIn(): boolean {
    if (!this.auth2) return false;
    return this.auth2.isSignedIn.get();
  }
}
