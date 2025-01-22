import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { TableService } from "../../api/xano/services/table/table.service.js";
import { CreateTableTool } from "../tools/table/create.js";
import { CreateTableInput } from "../types/tools.js";

export class XanoMcpServer {
  private server: Server;
  private createTableTool: CreateTableTool;

  constructor(tableService: TableService) {
    // Initialize the server with metadata
    this.server = new Server(
      {
        name: "xano-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {
            create_table: {
              ...CreateTableTool.getMetadata(),
              inputSchema: CreateTableTool.getInputSchema(),
            },
          },
        },
      },
    );

    // Initialize tools
    this.createTableTool = new CreateTableTool(tableService);

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
          ...CreateTableTool.getMetadata(),
          inputSchema: CreateTableTool.getInputSchema(),
        },
      ],
    }));

    // Handler for executing tools
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
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
            const input: CreateTableInput = {
              name: request.params.arguments.name,
              workspaceId: request.params.arguments.workspaceId,
            };
            const tableId = await this.createTableTool.execute(input);
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
