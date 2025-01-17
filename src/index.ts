import { xano } from "./api/xano/services/auth";
import { xano as xanoRequests } from "./api/xano/types/requests";

async function main() {
  const result = await xano.auth(xanoRequests.api_key);
  if (result.error != null) {
    console.log("Something went wrong:", result);
  } else {
    console.log("Success:", result.success);
  }
}

main().catch((error) => {
  console.log("Error:", error);
});

console.log("After async function call");
