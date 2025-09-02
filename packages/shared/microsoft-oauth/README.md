# Microsoft OAuth Integration

This library provides OAuth2 authentication for Microsoft Graph API, enabling secure access to Microsoft services like Excel Online.

## Features

- OAuth2 authentication flow using Microsoft Graph API
- Support for Edge browser and Chrome extension identity API
- Background service for token management
- Service layer for cross-extension messaging

## Scopes

- `https://graph.microsoft.com/Files.Read` - Read access to user files (for Excel)
- `https://graph.microsoft.com/User.Read` - User profile information
- `offline_access` - Refresh tokens for long-term access

## Usage

```typescript
import { MicrosoftOauthService, MICROSOFT_SCOPES } from '@dhruv-techapps/shared-microsoft-oauth';

// Login with specific scopes
const result = await MicrosoftOauthService.login([MICROSOFT_SCOPES.EXCEL, MICROSOFT_SCOPES.PROFILE]);

// Check access
const hasAccess = await MicrosoftOauthService.hasAccess([MICROSOFT_SCOPES.EXCEL]);

// Get user info
const userInfo = await MicrosoftOauthService.userInfo();

// Logout
await MicrosoftOauthService.logout([MICROSOFT_SCOPES.EXCEL]);
```

## Integration

The library is integrated into the extension background script and provides messaging services for cross-origin communication between the extension and options page.