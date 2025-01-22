import { ApiClient } from "./api/xano/client/base.js";
import { WorkspaceService } from "./api/xano/services/workspace/workspace.service.js";
import { XanoMcpServer } from "./mcp/server/server.js";
import config from "./config.js";

// Initialize API client and services
const client = new ApiClient(config);
const workspaceService = new WorkspaceService(client.axiosInstance);
const tableService = workspaceService.getTableService(92101);

// Initialize and start MCP server
const mcpServer = new XanoMcpServer(tableService);
mcpServer.start().catch(console.error);

// Example usage of the API client (commented out)
/*
const schemaService = tableService.getSchemaService(416127);
const contentService = tableService.getContentService(416127);

(async () => {
    const resp = await workspaceService.get();
    const space = resp.data;
    console.log("\n", JSON.stringify(space));
    
    const resp2 = await tableService.listAll();
    console.log("\n", JSON.stringify(resp2));
    
    //const resp3 = await tableService.post({ name: "Newtable" });
    //console.log(JSON.stringify(resp3.data));
    //const resp4 = await tableService.delete(resp3.data.id);
    //console.log(resp4);
    
    const resp3 = await schemaService.get();
    const tableSchema = resp3.data;

    const content = await contentService.listAll();
    const mappedValues = getValuesUsingSchema(tableSchema, content[0]);

    const newcontent = contentService.put(mappedValues.get("id") as number, {
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
*/
