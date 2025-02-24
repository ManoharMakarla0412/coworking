export interface APILog {
    time: string;
    requestUrl: string;
    requestDurationSeconds: number;
    requestHttpMethod: string;
    responseHttpCode: number;
    resource: string;
    id: string;
  }
  
export interface APIResponse {
    results: APILog[];
    metadata: {
      totalItems: number;
      itemsPerPage: number;
      currentPage: number;
    };
  }