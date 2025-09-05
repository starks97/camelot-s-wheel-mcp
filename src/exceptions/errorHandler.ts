import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { z } from "zod";

export default class ErrorHandler {
  static handleToolError(error: unknown, toolName: string): never {
    if (error instanceof McpError) {
      throw error;
    }

    if (error instanceof z.ZodError) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid arguments for ${toolName}: ${error.errors.map((e) => e.message).join(", ")}`,
      );
    }

    throw new McpError(
      ErrorCode.InternalError,
      `Unexpected error in ${toolName}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  static handleGeneralError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const errorResponseStatus = error.response?.status;
      const errorResponseData =
        error.response?.data.error!.message || error.message;
      throw new McpError(
        ErrorCode.InternalError,
        `Spotify API error (${errorResponseStatus}): ${errorResponseData}`,
      );
    }
    if (error instanceof McpError) {
      throw error;
    }

    if (error instanceof z.ZodError) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: ${error.errors.map((e) => e.message).join(", ")}`,
      );
    }
    throw new McpError(
      ErrorCode.InternalError,
      `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
