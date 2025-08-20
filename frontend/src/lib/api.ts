const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface SessionResponse {
  session_id: string;
}

interface UploadResponse {
  name: string;
  kind: string;
}

interface TableInfo {
  name: string;
  kind: string;
  db?: string;
}

interface ColumnInfo {
  name: string;
  type: string;
}

interface SchemaResponse {
  table: string;
  columns: ColumnInfo[];
}

interface QueryRequest {
  sql: string;
  limit?: number;
  offset?: number;
}

interface QueryResponse {
  columns: ColumnInfo[];
  rows: any[][];
  total_est?: number;
  duration_ms: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    sessionId?: string
  ): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (sessionId) {
        headers['X-Session-Id'] = sessionId;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.detail || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        return { error: errorMessage };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  async createSession(): Promise<ApiResponse<SessionResponse>> {
    return this.request<SessionResponse>('/session', {
      method: 'POST',
    });
  }

  async uploadFile(file: File, sessionId: string): Promise<ApiResponse<UploadResponse>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        headers: {
          'X-Session-Id': sessionId,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.detail || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        return { error: errorMessage };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('File upload failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  async getTables(sessionId: string): Promise<ApiResponse<TableInfo[]>> {
    return this.request<TableInfo[]>('/tables', {
      method: 'GET',
    }, sessionId);
  }

  async getSchema(tableName: string, sessionId: string): Promise<ApiResponse<SchemaResponse>> {
    return this.request<SchemaResponse>(`/schema?table=${encodeURIComponent(tableName)}`, {
      method: 'GET',
    }, sessionId);
  }

  async executeQuery(queryRequest: QueryRequest, sessionId: string): Promise<ApiResponse<QueryResponse>> {
    return this.request<QueryResponse>('/query', {
      method: 'POST',
      body: JSON.stringify(queryRequest),
    }, sessionId);
  }
}

export const apiClient = new ApiClient();

export type {
  SessionResponse,
  UploadResponse,
  TableInfo,
  ColumnInfo,
  SchemaResponse,
  QueryRequest,
  QueryResponse,
};