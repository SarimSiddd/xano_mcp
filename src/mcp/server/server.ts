import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { WorkspaceService } from "../../api/xano/services/workspace/workspace.service.js";
import { paginationParams } from "../../api/xano/models/common/pagination.js";
import { CreateTableTool } from "../tools/table/create.js";
import { GetTableContentTool } from "../tools/table/get-content.js";
import { AddTableContentTool } from "../tools/table/add-content.js";
import { UpdateTableContentTool } from "../tools/table/update-content.js";
import { GetWorkspacesTool } from "../tools/workspace/get.js";
import { GetAllTablesTool } from "../tools/table/get-all-tables.js";
import {
  CreateTableInput,
  GetTableContentInput,
  AddTableContentInput,
  UpdateTableContentInput,
} from "../types/tools.js";

export class XanoMcpServer {
  private server: Server;
  private getWorkspacesTool: GetWorkspacesTool;
  private getAllTablesTool: GetAllTablesTool;

  constructor(private readonly workspaceService: WorkspaceService) {
    // Initialize the server with metadata
    this.server = new Server(
      {
        name: "xano-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {
            get_workspaces: {
              ...GetWorkspacesTool.getMetadata(),
              inputSchema: GetWorkspacesTool.getInputSchema(),
            },
            create_table: {
              ...CreateTableTool.getMetadata(),
              inputSchema: CreateTableTool.getInputSchema(),
            },
            get_table_content: {
              ...GetTableContentTool.getMetadata(),
              inputSchema: GetTableContentTool.getInputSchema(),
            },
            add_table_content: {
              ...AddTableContentTool.getMetadata(),
              inputSchema: AddTableContentTool.getInputSchema(),
            },
            update_table_content: {
              ...UpdateTableContentTool.getMetadata(),
              inputSchema: UpdateTableContentTool.getInputSchema(),
            },
            get_all_tables: {
              ...GetAllTablesTool.getMetadata(),
              inputSchema: GetAllTablesTool.getInputSchema(),
            },
          },
        },
      },
    );

    // Initialize tools
    this.getWorkspacesTool = new GetWorkspacesTool(workspaceService);
    this.getAllTablesTool = new GetAllTablesTool(
      workspaceService.getTableService(0),
    ); // Will be replaced with correct workspaceId in execute

    // Set up request handlers
    this.setupRequestHandlers();

    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupRequestHandlers(): void {
    // Handler for listing available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          ...GetWorkspacesTool.getMetadata(),
          inputSchema: GetWorkspacesTool.getInputSchema(),
        },
        {
          ...CreateTableTool.getMetadata(),
          inputSchema: CreateTableTool.getInputSchema(),
        },
        {
          ...GetTableContentTool.getMetadata(),
          inputSchema: GetTableContentTool.getInputSchema(),
        },
        {
          ...AddTableContentTool.getMetadata(),
          inputSchema: AddTableContentTool.getInputSchema(),
        },
        {
          ...UpdateTableContentTool.getMetadata(),
          inputSchema: UpdateTableContentTool.getInputSchema(),
        },
        {
          ...GetAllTablesTool.getMetadata(),
          inputSchema: GetAllTablesTool.getInputSchema(),
        },
      ],
    }));

    // Handler for executing tools
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case "get_workspaces": {
          try {
            const workspaces = await this.getWorkspacesTool.execute();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(workspaces, null, 2),
                },
              ],
            };
          } catch (error) {
            if (error instanceof Error) {
              throw new McpError(
                ErrorCode.InternalError,
                `Failed to get workspaces: ${error.message}`,
              );
            }
            throw new McpError(
              ErrorCode.InternalError,
              "Failed to get workspaces: Unknown error",
            );
          }
        }
        case "create_table": {
          try {
            if (
              !request.params.arguments ||
              typeof request.params.arguments.name !== "string" ||
              typeof request.params.arguments.workspaceId !== "number"
            ) {
              throw new McpError(
                ErrorCode.InvalidParams,
                "Invalid arguments: name (string) and workspaceId (number) are required",
              );
            }
            const workspaceId = request.params.arguments.workspaceId;
            const tableService =
              this.workspaceService.getTableService(workspaceId);
            const createTableTool = new CreateTableTool(tableService);
            const input: CreateTableInput = {
              name: request.params.arguments.name,
              workspaceId,
            };
            const tableId = await createTableTool.execute(input);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({ tableId }, null, 2),
                },
              ],
            };
          } catch (error) {
            if (error instanceof Error) {
              throw new McpError(
                ErrorCode.InternalError,
                `Failed to create table: ${error.message}`,
              );
            }
            throw new McpError(
              ErrorCode.InternalError,
              "Failed to create table: Unknown error",
            );
          }
        }
        case "get_table_content": {
          try {
            if (
              !request.params.arguments ||
              typeof request.params.arguments.tableId !== "string" ||
              typeof request.params.arguments.workspaceId !== "string"
            ) {
              throw new McpError(
                ErrorCode.InvalidParams,
                "Invalid arguments: tableId (string) and workspaceId (string) are required",
              );
            }
            const workspaceId = Number(request.params.arguments.workspaceId);
            const tableService =
              this.workspaceService.getTableService(workspaceId);
            const getTableContentTool = new GetTableContentTool(tableService);
            const input: GetTableContentInput = {
              tableId: Number(request.params.arguments.tableId),
              workspaceId,
              pagination: request.params.arguments.pagination as
                | paginationParams
                | undefined,
            };
            const content = await getTableContentTool.execute(input);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(content, null, 2),
                },
              ],
            };
          } catch (error) {
            if (error instanceof Error) {
              throw new McpError(
                ErrorCode.InternalError,
                `Failed to get table content: ${error.message}`,
              );
            }
            throw new McpError(
              ErrorCode.InternalError,
              "Failed to get table content: Unknown error",
            );
          }
        }
        case "add_table_content": {
          try {
            if (
              !request.params.arguments ||
              typeof request.params.arguments.tableId !== "string" ||
              typeof request.params.arguments.workspaceId !== "string" ||
              typeof request.params.arguments.content !== "object"
            ) {
              throw new McpError(
                ErrorCode.InvalidParams,
                "Invalid arguments: tableId (string), workspaceId (string), and content (object) are required",
              );
            }
            const workspaceId = Number(request.params.arguments.workspaceId);
            const tableService =
              this.workspaceService.getTableService(workspaceId);
            const addTableContentTool = new AddTableContentTool(tableService);
            const input: AddTableContentInput = {
              tableId: Number(request.params.arguments.tableId),
              workspaceId,
              content: request.params.arguments.content as Record<string, any>,
            };
            const content = await addTableContentTool.execute(input);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(content, null, 2),
                },
              ],
            };
          } catch (error) {
            console.error("Add table content error:", error);
            if (error instanceof Error) {
              throw new McpError(
                ErrorCode.InternalError,
                `Failed to add table content: ${error.message}`,
              );
            }
            if (typeof error === "object" && error !== null) {
              throw new McpError(
                ErrorCode.InternalError,
                `Failed to add table content: ${JSON.stringify(error)}`,
              );
            }
            throw new McpError(
              ErrorCode.InternalError,
              `Failed to add table content: ${error}`,
            );
          }
        }
        case "update_table_content": {
          try {
            if (
              !request.params.arguments ||
              typeof request.params.arguments.tableId !== "string" ||
              typeof request.params.arguments.workspaceId !== "string" ||
              typeof request.params.arguments.contentId !== "string" ||
              typeof request.params.arguments.content !== "object"
            ) {
              throw new McpError(
                ErrorCode.InvalidParams,
                "Invalid arguments: tableId (string), workspaceId (string), contentId (string), and content (object) are required",
              );
            }
            const workspaceId = Number(request.params.arguments.workspaceId);
            const tableService =
              this.workspaceService.getTableService(workspaceId);
            const updateTableContentTool = new UpdateTableContentTool(
              tableService,
            );
            const input: UpdateTableContentInput = {
              tableId: Number(request.params.arguments.tableId),
              workspaceId,
              contentId: request.params.arguments.contentId,
              content: request.params.arguments.content as Record<string, any>,
            };
            const content = await updateTableContentTool.execute(input);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(content, null, 2),
                },
              ],
            };
          } catch (error) {
            if (error instanceof Error) {
              throw new McpError(
                ErrorCode.InternalError,
                `Failed to update table content: ${error.message}`,
              );
            }
            throw new McpError(
              ErrorCode.InternalError,
              "Failed to update table content: Unknown error",
            );
          }
        }
        case "get_all_tables": {
          try {
            if (
              !request.params.arguments ||
              typeof request.params.arguments.workspaceId !== "number"
            ) {
              throw new McpError(
                ErrorCode.InvalidParams,
                "Invalid arguments: workspaceId (number) is required",
              );
            }
            const workspaceId = request.params.arguments.workspaceId;
            const tableService =
              this.workspaceService.getTableService(workspaceId);
            this.getAllTablesTool = new GetAllTablesTool(tableService);
            const tables = await this.getAllTablesTool.execute({ workspaceId });
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(tables, null, 2),
                },
              ],
            };
          } catch (error) {
            if (error instanceof Error) {
              throw new McpError(
                ErrorCode.InternalError,
                `Failed to get all tables: ${error.message}`,
              );
            }
            throw new McpError(
              ErrorCode.InternalError,
              "Failed to get all tables: Unknown error",
            );
          }
        }
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`,
          );
      }
    });
  }

  /**
   * Start the MCP server
   */
  public async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Xano MCP server running on stdio");
  }

  /**
   * Stop the MCP server
   */
  public async stop(): Promise<void> {
    await this.server.close();
  }
}
