export type AzureStorageOptions = {
    accountName: string;
    accountKey: string;
    containerName: string;
};


export type UploadedFileMetadata = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: string;
};
