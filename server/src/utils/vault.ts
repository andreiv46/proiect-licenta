import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import "dotenv/config";

const credentials = new DefaultAzureCredential();

const vaultUrl = process.env.VAULT_URL || "";

const client = new SecretClient(vaultUrl, credentials);

export default client;
