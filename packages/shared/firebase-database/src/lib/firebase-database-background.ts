import { Auth, FirebaseOauth2Background } from '@dhruv-techapps/shared-firebase-oauth';
import { Database, getDatabase } from 'firebase/database';

export class FirebaseDatabaseBackground extends FirebaseOauth2Background {
  db: Database;

  constructor(auth: Auth, edgeClientId?: string) {
    super(auth, edgeClientId);
    this.db = getDatabase();
  }
}
