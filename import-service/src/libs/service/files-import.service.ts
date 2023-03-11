import * as AWS from "aws-sdk";
import * as csvParser from "csv-parser";
import { ConfigEnum } from "@libs/enums/config.enum";

class ParseFileService {
  private s3: AWS.S3 = new AWS.S3({ region: "eu-central-1" });

  async parseAndMoveFile(name: string): Promise<void> {
    await this.parseFile(name);
    await this.moveToFolderParsed(name);
  }

  private parseFile(name: string): Promise<void> {
    const results = [];

    console.log("Parsing CSV file started");

    return new Promise<void>((res, rej) => {
      this.s3
        .getObject({
          Bucket: ConfigEnum.BUCKET_NAME,
          Key: name,
        })
        .createReadStream()
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          console.log(`Parsing of file ${name} finished!`);
          console.log(results);
          res();
        })
        .on("error", (error) => {
          console.error(`Parsing of file ${name} error`);
          rej(error);
        });
    });
  }

  private async moveToFolderParsed(name: string): Promise<void> {
    console.log(`Started moving file ${name} to parsed folder`);

    await this.s3
      .copyObject({
        Bucket: ConfigEnum.BUCKET_NAME,
        CopySource: ConfigEnum.BUCKET_NAME + "/" + name,
        Key: name.replace("uploaded", "parsed"),
      })
      .promise();

    console.log(`File ${name} copied to parsed folder`);

    await this.s3
      .deleteObject({
        Bucket: ConfigEnum.BUCKET_NAME,
        Key: name,
      })
      .promise();

    console.log(`File ${name} deleted from uploaded folder`);
  }
}

export default new ParseFileService();