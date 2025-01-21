import { ApiClient } from "./api/xano/client/base";
import { WorkspaceService } from "./api/xano/services/workspace/workspace.service";
import { getValuesUsingSchema } from "./api/xano/utils/typevalidator";
import config from "./config";

let client = new ApiClient(config);
let workspaceService = new WorkspaceService(client.axiosInstance);
let tableService = workspaceService.getTableService(92101);
let schemaService = tableService.getSchemaService(416127);
let contentService = tableService.getContentService(416127);

(async () => {
  let resp = await workspaceService.get();
  let space = resp.data;
  console.log("\n", JSON.stringify(space));
  let resp2 = await tableService.listAll();
  console.log("\n", JSON.stringify(resp2));
  //let resp3 = await tableService.post({ name: "Newtable" });
  //console.log(JSON.stringify(resp3.data));
  //let resp4 = await tableService.delete(resp3.data.id);
  //console.log(resp4);
  let resp3 = await schemaService.get();
  let tableSchema = resp3.data;

  let content = await contentService.listAll();

  let mappedValues = getValuesUsingSchema(tableSchema, content[0]);

  let newcontent = contentService.put(mappedValues.get("id") as number, {
    created_at: 1736342870473,
    account_id: "CR90000000",
    client_id: 1,
    balance: 10,
    currency: "USD",
    lock: false,
  });

  console.log(mappedValues);
  console.log(newcontent);
})();
