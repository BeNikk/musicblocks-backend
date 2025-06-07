import dotenv from 'dotenv';
import fs from "fs";
import path from 'path';

dotenv.config();

export const config = {
  appId: process.env.GITHUB_APP_ID,
  org: process.env.ORG_NAME,
  privateKey: fs.readFileSync(path.resolve(__dirname,'../../src/config', './private-key.pem'), "utf-8"),
  installationId: process.env.GITHUB_INSTALLATION_ID,
};
