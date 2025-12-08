export class UserStorage {
  static KEY = 'user_id';
  // Placeholder for future user-related storage methods
  static async setUserId(userId: string) {
    await chrome.storage.local.set({ [UserStorage.KEY]: userId });
  }

  static async getUserId(): Promise<string | undefined> {
    const result = await chrome.storage.local.get<{ [UserStorage.KEY]: string }>([UserStorage.KEY]);
    return result[UserStorage.KEY];
  }
}
