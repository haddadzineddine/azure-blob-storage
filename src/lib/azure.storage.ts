import * as Azure from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import { AzureStorageOptions } from '../types/azure-storage.options';
import { UploadedFileMetadata } from '../types/uploaded-file.metadata';

export class AzureStorage {
  private static azureStorage: AzureStorage;

  private constructor(
    private azureStorageOptions: AzureStorageOptions,
    private readonly blobServiceClient: Azure.BlobServiceClient,
  ) {}

  static async asyncSetUp(
    azureStorageOptions: AzureStorageOptions,
  ): Promise<AzureStorage> {
    try {
      if (!AzureStorage.azureStorage) {
        if (
          !AzureStorage._isValidContainerName(azureStorageOptions.containerName)
        ) {
          throw new Error(
            `Error encountered: The container name must be at least 3 characters long.`,
          );
        }

        const sharedKeyCredential = new Azure.StorageSharedKeyCredential(
          azureStorageOptions.accountName,
          azureStorageOptions.accountKey,
        );

        try {
          const blobServiceClient = await AzureStorage._getBlobServiceClient({
            accountName: azureStorageOptions.accountName,
            sharedKeyCredential,
          });

          AzureStorage.azureStorage = new AzureStorage(
            azureStorageOptions,
            blobServiceClient,
          );
        } catch (error) {
          throw new Error(`Error encountered: ${error}`);
        }
      }

      return AzureStorage.azureStorage;
    } catch (error) {
      throw new Error(`Error encountered: ${error}`);
    }
  }

  public changeContainer(containerName: string) {
    this.azureStorageOptions.containerName = containerName;
  }

  async uploadFile(file: UploadedFileMetadata): Promise<string> {
    if (!AzureStorage.azureStorage) {
      throw new Error(
        `Error encountered: You need to set up AzureStorage before you can upload a file.`,
      );
    }

    if (!file.buffer) {
      throw new Error(
        `Error encountered: File is not a valid Buffer (missing buffer property)`,
      );
    }

    const containerClient = await this._createContainerIfNotExists();
    const blockBlobClient = this._getBlockBlobClient(
      containerClient,
      this._generateRandomBlobName(),
    );
    const options = { blobHTTPHeaders: { blobContentType: file.mimetype } };

    await blockBlobClient.upload(file.buffer, file.buffer.byteLength, options);

    return blockBlobClient.url;
  }

  private static async _getBlobServiceClient(options: {
    accountName: string;
    sharedKeyCredential: Azure.StorageSharedKeyCredential;
  }): Promise<Azure.BlobServiceClient> {
    return new Azure.BlobServiceClient(
      `https://${options.accountName}.blob.core.windows.net`,
      options.sharedKeyCredential,
    );
  }

  private async _createContainerIfNotExists(): Promise<Azure.ContainerClient> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.azureStorageOptions.containerName,
    );

    const containerExists = await containerClient.exists();

    if (!containerExists) {
      await containerClient.create();
    }

    return containerClient;
  }

  private static _isValidContainerName(containerName: string): boolean {
    return containerName.length > 2;
  }

  private _getBlockBlobClient(
    containerClient: Azure.ContainerClient,
    blobName: string,
  ): Azure.BlockBlobClient {
    return containerClient.getBlockBlobClient(blobName);
  }

  private _generateRandomBlobName(): string {
    return uuidv4();
  }
}
