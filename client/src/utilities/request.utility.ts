const baseUrl = 'http://localhost:3001';
export const defaultErrorMessage = 'Something went wrong.';

export class HttpError extends Error {
  message: string;
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.message = message;
    this.status = status;
  }
}

export async function PostRequest(endpoint: string, data: any) {
  const response = await fetch(
    `${baseUrl}${endpoint}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }
  );
  const decoded = await response.json();

  if (!response.ok) throw new HttpError(decoded.message ?? defaultErrorMessage, response.status);

  return decoded;
}

export async function UpdateRequest(endpoint: string, data: any) {
  const response = await fetch(
    `${baseUrl}${endpoint}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }
  );
  const decoded = await response.json();

  if (!response.ok) throw new HttpError(decoded.message ?? defaultErrorMessage, response.status);

  return decoded;
}

export async function GetRequest(endpoint: string) {
  const response = await fetch(`${baseUrl}${endpoint}`);
  const decoded = await response.json();

  if (!response.ok) throw new HttpError(decoded.message ?? defaultErrorMessage, response.status);

  return decoded;
}