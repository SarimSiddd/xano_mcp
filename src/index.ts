import { ApiClient } from "./api/xano/client/base";
import { WorkspaceService } from "./api/xano/services/workspace/workspace.service";
import config from "./config";

let client = new ApiClient(config);
let workspaceService = new WorkspaceService(client.axiosInstance);
let tableService = workspaceService.getTableService(92101);

(async () => {
  let resp = await workspaceService.get();
  let space = resp.data;
  console.log("\n", JSON.stringify(space));
  let resp2 = await tableService.listAll();
  console.log("\n", JSON.stringify(resp2));
})();

// import { auth } from "./api/xano/services/auth";
// import config from "./config";

// async function main(): Promise<void> {
//   const result = await auth(config.xano.apiKey);
//   if (result.error != null) {
//     console.log("Something went wrong:", result);
//   } else {
//     console.log("Success:", result.success);
//   }
// }

// main().catch((error) => console.log("Error:", error));

// console.log("After async function call");
