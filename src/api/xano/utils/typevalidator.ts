export class typeValidator {
  private static readonly validators = new Map<string, (value: any) => boolean>(
    [
      ["string", (value: any): boolean => typeof value === "text"],
      ["number", (value: any): boolean => typeof value === "int"],
    ],
  );
}
