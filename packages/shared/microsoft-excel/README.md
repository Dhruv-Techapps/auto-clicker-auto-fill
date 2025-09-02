# Microsoft Excel Integration

This library provides integration with Microsoft Excel Online via Microsoft Graph API, enabling the extension to read data from Excel workbooks for form automation.

## Features

- Read Excel workbook data via Microsoft Graph API
- A1 notation range support (e.g., `Sheet1!A1`, `Sheet1!B1:C10`)
- Content script integration for value extraction
- Background service for API calls
- Session and batch repeat support
- Error handling and notifications

## Usage

### In Configuration

Add a `workbookId` to your configuration:

```json
{
  "url": "https://example.com",
  "workbookId": "your-excel-workbook-id",
  "actions": [
    {
      "elementFinder": "//input[@name='username']",
      "value": "MicrosoftExcel::Sheet1!A1"
    }
  ]
}
```

### Value Patterns

- `MicrosoftExcel::Sheet1!A1` - Get cell A1 from Sheet1
- `MicrosoftExcel::Sheet1!B<batchRepeat>` - Dynamic cell based on batch iteration
- `MicrosoftExcel::Sheet1!C<sessionCount>` - Dynamic cell based on session count

### Service Usage

```typescript
import { MicrosoftExcelService } from '@dhruv-techapps/shared-microsoft-excel';

const data = await MicrosoftExcelService.getWorkbook(workbookId, ['Sheet1!A1:C10']);
```

## Integration

The library integrates with the extension's configuration system and automatically fetches required data when a configuration uses `MicrosoftExcel::` value patterns.