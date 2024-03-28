# REST API Overview
A parameter name wrapped in square brackets indicates that it's an optional parameter.

# Types
## EntryKind
```typescript
type EntryKind = "dir" | "file" | "other";
```

## EntryMetadata
```typescript
type EntryMetadata = {
  basename: string, // Filename. e.g. "file1"
  size: number; // Size in bytes.
  isSymlink: boolean;
  kind: EntryKind;
  created: number; // Unix Timestamp
  modified: number; // Unix Timestamp
}
```

## EntryChildren
```typescript
type EntryChildren = {
  parent: string, // Parent directory. e.g. "/dir1/"
  children: EntryMetadata[],
}
```

# Methods
## get
Returns entry data. Use alt query parameter to control what kind of data is returned.

### HTTP request
GET /api/entries/:path

### Query Parameters
| Parameter | Default value | Description                                                                                                        |
|-----------|---------------|--------------------------------------------------------------------------------------------------------------------|
| alt       | metadata | Type of data to return. metadata - EntryMetadata as json, children - EntryChildren as json, raw - raw bytes, thumb - JPEG thumbnail |

### Examples
| Request                           | Description                                                 |
|-----------------------------------|-------------------------------------------------------------|
| /api/entries/dir1                 | Returns EntryMetadata, since alt defaults to metadata.      |
| /api/entries/dir1?alt=children    | Returns EntryChildren.                                      |
| /api/entries/dir1/file1           | Returns EntryMetadata, since alt defaults to metadata.      |
| /api/entries/dir1/file1?alt=raw   | Returns raw bytes with the appropriate Content-Type header. |
| /api/entries/dir1/file1?alt=thumb | Returns JPEG thumbnail.                                     |
