import * as Azure from '@azure/storage-blob';
import { UploadedFileMetadata } from './../src/types/uploaded-file.metadata';
import { AzureStorage } from './../src/lib/azure.storage';

let azureStorage: AzureStorage;

const buffer = Buffer.from('test');

const file: UploadedFileMetadata = {
  buffer,
  fieldname: 'file',
  originalname: 'test.txt',
  encoding: 'utf-8',
  mimetype: 'text/plain',
  size: buffer.length + '',
};

const mockAzure = Azure as jest.Mocked<typeof Azure>;

describe('Azure Storage Service', () => {
  beforeEach(async () => {
    azureStorage = await AzureStorage.asyncSetUp({
      accountName: 'AZURE_STORAGE_ACCOUNT_NAME',
      accountKey: 'AZURE_STORAGE_ACCOUNT_KEY',
      containerName: 'AZURE_STORAGE_CONTAINER_NAME',
    });
  });

  it('should be defined', () => {
    expect(azureStorage).toBeDefined();
  });
});
