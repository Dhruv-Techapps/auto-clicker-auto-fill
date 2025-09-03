# Microsoft OAuth Package

A Microsoft OAuth 2.0 authentication package for Auto Clicker AutoFill web extensions.

## Overview

This package provides Microsoft OAuth authentication functionality for Chrome web extensions, enabling secure sign-in with Microsoft accounts.

## Features

- Microsoft OAuth 2.0 authentication flow
- Chrome extension identity API integration
- Token management and refresh
- User information retrieval from Microsoft Graph
- Scope-based permission handling

## Installation

```bash
npm install @dhruv-techapps/shared-microsoft-oauth
```

## Usage

### Basic Authentication

```typescript
import { MicrosoftOauth2Background, MICROSOFT_SCOPES } from '@dhruv-techapps/shared-microsoft-oauth';

// Initialize with Microsoft client ID
const microsoftAuth = new MicrosoftOauth2Background('your-microsoft-client-id');

// Login
const result = await microsoftAuth.login([MICROSOFT_SCOPES.PROFILE]);
console.log('Access token:', result.token);

// Get user info
const userInfo = await microsoftAuth.userInfo();
console.log('User:', userInfo);

// Logout
await microsoftAuth.logout();
```

### Service Layer

```typescript
import { MicrosoftOauthService, MICROSOFT_SCOPES } from '@dhruv-techapps/shared-microsoft-oauth';

// For cross-context messaging in extensions
await MicrosoftOauthService.login([MICROSOFT_SCOPES.PROFILE]);
const userInfo = await MicrosoftOauthService.userInfo();
await MicrosoftOauthService.logout([MICROSOFT_SCOPES.PROFILE]);
```

## Configuration

### Azure App Registration

1. Register your application in the [Azure Portal](https://portal.azure.com)
2. Configure redirect URI: `https://<extension-id>.chromiumapp.org/`
3. Note the Application (client) ID

### Extension Manifest

```json
{
  "permissions": ["identity"],
  "oauth2": {
    "client_id": "your-microsoft-client-id",
    "scopes": ["https://graph.microsoft.com/User.Read", "openid"]
  }
}
```

## Available Scopes

- `MICROSOFT_SCOPES.PROFILE` - Read user profile
- `MICROSOFT_SCOPES.EMAIL` - Read user email
- `MICROSOFT_SCOPES.OPENID` - OpenID Connect
- `MICROSOFT_SCOPES.OFFLINE_ACCESS` - Refresh token access

## API Reference

### MicrosoftOauth2Background

Main class for handling Microsoft OAuth in background scripts.

#### Methods

- `login(scopes?)` - Initiate login flow
- `logout(scopes?)` - Remove cached tokens
- `userInfo()` - Get user information
- `hasAccess(scopes)` - Check token validity

### MicrosoftOauthService

Service layer for cross-context messaging.

#### Static Methods

- `login(scopes)` - Login via messaging
- `logout(scopes)` - Logout via messaging
- `userInfo()` - Get user info via messaging
- `hasAccess(scopes)` - Check access via messaging

## Error Handling

The package includes comprehensive error handling for common OAuth scenarios:

- Missing client ID
- Network errors
- User cancellation
- Invalid credentials

## Browser Support

- Chrome extensions
- Edge extensions
- Other Chromium-based browsers

## Integration with Firebase

For Firebase Authentication integration, use alongside `@dhruv-techapps/shared-firebase-oauth`:

```typescript
import { FirebaseMicrosoftOauth2Background } from '@dhruv-techapps/shared-firebase-oauth';

const firebaseAuth = new FirebaseMicrosoftOauth2Background(auth, 'microsoft-client-id');
await firebaseAuth.firebaseLogin();
```

## Security Considerations

- Client IDs should be stored securely
- Use appropriate scopes for your use case
- Implement proper token refresh logic
- Handle authentication errors gracefully

## Contributing

This package is part of the Auto Clicker AutoFill monorepo. See the main repository for contribution guidelines.
