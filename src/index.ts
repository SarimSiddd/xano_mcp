import { auth } from "./api/xano/services/auth";
import config from "./config";

async function main(): Promise<void> {
  const result = await auth(config.xano.apiKey);
  if (result.error != null) {
    console.log("Something went wrong:", result);
  } else {
    console.log("Success:", result.success);
  }
}

main().catch((error) => console.log("Error:", error));

console.log("After async function call");
