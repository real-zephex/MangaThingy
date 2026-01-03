export class ScraperError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ScraperError";
  }
}

export const createErrorResponse = (
  statusCode: number,
  message: string,
  details?: unknown
) => {
  return {
    status: statusCode,
    results: message,
    details,
  };
};

export const handleScraperError = (error: unknown) => {
  if (error instanceof ScraperError) {
    return createErrorResponse(error.statusCode, error.message, error.details);
  }

  if (error instanceof Error) {
    return createErrorResponse(500, error.message);
  }

  return createErrorResponse(500, "An unknown error occurred");
};
