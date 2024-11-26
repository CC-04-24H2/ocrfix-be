const { Storage } = require('@google-cloud/storage');

class CloudStorage {
  storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.GCS_SERVICE_ACCOUNT,
  });

  bucketName = process.env.BUCKET_NAME;

  async uploadFile(file, filename) {
    await this.storage.bucket(this.bucketName).file(filename).save(file);
  }
}

module.exports = CloudStorage;
