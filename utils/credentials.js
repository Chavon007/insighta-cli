import fs from "fs";
import os from "os";
import path from "path";

const credentialsDir = path.jsoin(os.homedir(), "insighta");
const credentialsFile = path.join(credentialsDir, "credentials.json");

export const saveCredentials = (data) => {
  if (!fs.existsSync(credentialsDir)) {
    fs.mkdirSync(credentialsDir, { recursive: true });
  }
  fs.writeFileSync(credentialsFile, JSON.stringify(data, null, 2));
};

export const getCredentials = () => {
  if (!fs.existsSync(credentialsFile)) return null;
  const data = fs.readFileSync(credentialsFile, "utf-8");
  return JSON.parse(data);
};

export const clearCredentials = () => {
  if (fs.existsSync(credentialsFile)) {
    fs.unlinkSync(credentialsFile);
  }
};
