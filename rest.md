# REST API Overview
Endpoint: /api/entries/{:pathToEntry}.

A parameter name wrapped in square brackets indicates that it's an optional parameter.

| HTTP Method | URI Parameters              | Request Headers | Response Headers         | Request Body | Response Body        | Description                                             | 
|-------------|-----------------------------|-----------------|--------------------------|--------------|----------------------|---------------------------------------------------------|
| HEAD        |                             |                 | EntryMetadata as headers |              |                      | Returns file system metadata for an entry.              |
| GET         |                             | [Range]         |                          |              |                      | Returns bytes of a file.                                |
| GET         | type=dir, [cursor], [limit] | [If-Match]      | [ETag]                   |              | JSON EntryMetadata[] | Returns a list of entries in a directory.               |
| PUT         | [type]                      |                 |                          |              |                      | Creates an empty entry.                                 |
| PUT         | type=file                   |                 |                          | Bytes        |                      | Uploads a file.                                         |
| PUT         | act=rename                  | x-ar-source     |                          |              |                      | Renames an entry at x-ar-source to the path in the URI. |
| PUT         | type=file, act=copy         | x-ar-source     |                          |              |                      | Copies a file from x-ar-source into the destination.    |
| DELETE      |                             |                 |                          |              |                      | Removes a file.                                         |
| DELETE      | type=dir                    |                 |                          |              |                      | Removes an empty directory.                             |

### EntryMetadata as headers
| EntryMetadata property | Header         |
|------------------------|----------------|
| basename               | x-ar-basename  |
| size                   | x-ar-size      |
| isSymlink              | x-ar-is-symlink|
| kind                   | x-ar-kind      |
| created                | x-ar-created   |
| modified               | x-ar-modified  |
| preview                | x-ar-preview   |

## URI Parameters
| Parameter | Type    | Default | Allowed values | Description                                       | Example |
|-----------|---------|---------|----------------|---------------------------------------------------|---------|
| act       | string  |         | rename, copy   | Action to perform on an entry.                    | rename  |
| type      | string  | file    | dir, file      | Entry type. Can be either a directory or a file.  | dir     |
| cursor    | integer | 0       |                | Offset from the beginning of the list of entries. | 246     |
| limit     | integer | 512     |                | Limit number of returned entries.                 | 64      |

## Headers
| Header   | Type           | Description                                            | Example    |
|----------|----------------|--------------------------------------------------------|------------|
| created  | integer        | Timestamp when the entry was created.                  | 1710712587 |
| modified | integer        | Timestamp when the entry was modified.                 | 1710712398 |
| size     | integer        | Entry length in bytes.                                 | 4096       |
| thumb    | boolean        | Indicates whether or not a thumbnail may be generated. | true       |

