# Azure Blob Storage

## Description

[Azure Blob Storage](https://www.npmjs.com/package/@haddad_zineddine/azure-blob-storage) is a package for node js.

## Before Installation

1. Create a Storage account and resource
2. In the [Azure Portal](https://portal.azure.com), go to **Dashboard > Storage > _your-storage-account_**.
3. Note down the "AccountName", "AccountKey" obtained at **Access keys**.

## Installation

1. Install the package using NPM:

```bash
$ npm i -S @haddad_zineddine/azure-blob-storage
```

2. Create or update your existing `.env` file with the following content:

```bash
AZURE_STORAGE_ACCOUNT_NAME=
AZURE_STORAGE_ACCOUNT_KEY=
AZURE_STORAGE_CONTAINER_NAME=
```

1. **IMPORTANT: Make sure to add your `.env` file to your `.gitignore`! The `.env` file MUST NOT be versionned on Git.**

2. Make sure to include the following call to your main file:

```typescript
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
```

> This line must be added before any other imports!

3. Import the `AzureStorageModule` with the following configuration:

```typescript
const azureStorage = AzureStorage.asyncSetUp({
    accountName:  process.env.AZURE_STORAGE_ACCOUNT_NAME=
    accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY
    containerName: process.env.AZURE_STORAGE_CONTAINER_NAME
});
```

4. Upload `File` to `Azure Blob Storage`:

```typescript
const fileUrl : string = await azureStorage.uploadFile(file: UploadedFileMetadata);
```

5. Delete `File` from `Azure Blob Storage` by it's blob name:

```typescript
await azureStorage.deleteFile(blobName: String);
```

## Stay in touch

- Author - [Haddad Zineddine](https://zineddine.netlify.com)

## License

MIT license.
