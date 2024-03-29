import {
    AzureKeyCredential,
    DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import "dotenv/config";
import vault from "./vault";
import * as fs from "fs";
import logger from "./logger";

let formRecognizerClient: DocumentAnalysisClient | null = null;

export async function initializeFormRecognizerClient() {
    const key = (await vault.getSecret("DIKey")).value;
    const endpoint = (await vault.getSecret("DIEndpoint")).value;
    if (!key || !endpoint) {
        throw new Error("Key or endpoint not found in the vault.");
    }
    formRecognizerClient = new DocumentAnalysisClient(
        endpoint,
        new AzureKeyCredential(key)
    );
    logger.info("Form Recognizer client initialized.");
}

export function getFormRecognizerClient() {
    if (!formRecognizerClient) {
        logger.error("Form Recognizer client not initialized.");
        process.exit(1);
    }
    return formRecognizerClient;
}

export const analyzeReceiptForm = async (formPath: string) => {
    const file = fs.createReadStream(formPath);
    const client = getFormRecognizerClient();
    const poller = await client.beginAnalyzeDocument("prebuilt-receipt", file);

    const pollerResult = await poller.pollUntilDone();

    if (!pollerResult.documents) {
        throw new Error("No documents in the result.");
    }

    const {
        documents: [result],
    } = pollerResult;

    if (result) {
        const { MerchantName, Items, Total } = result.fields;

        console.log("=== Receipt Information ===");
        console.log("Type:", result.docType);
        console.log("Merchant:", MerchantName && MerchantName.content);

        console.log("Items:");
        if (Items?.kind === "array") {
            for (const item of (Items && Items.values) || []) {
                if (item.kind === "object") {
                    const { Description, TotalPrice } = item.properties;

                    console.log(
                        "- Description:",
                        Description && Description.content
                    );
                    console.log(
                        "  Total Price:",
                        TotalPrice && TotalPrice.content
                    );
                }
            }
        }
        console.log("Total:", Total && Total.content);
    } else {
        throw new Error("Expected at least one receipt in the result.");
    }
};
