import { FileDataRequest } from '@savantly/sprout-api';
import { getFileService } from '@savantly/sprout-runtime';
import { API_HOST } from 'plugin/config/appModuleConfiguration';

class FMFileService {
  getFilesByPath = (path?: string) => {
    return getFileService().getFilesByPath(path);
  };

  deleteFileByPath = (path?: string) => {
    return getFileService().deleteFileByPath(path);
  };

  createFile = (request: FileDataRequest) => {
    return getFileService().createFile(request);
  };

  uploadFile = (request: FileDataRequest, file: any) => {
    //const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const metaData = new Blob([JSON.stringify(request)], { type: 'application/json' });

    let fd = new FormData();
    fd.append('file', file);
    fd.append('metaData', metaData);
    console.log(fd);
    return postFormFetch(`${API_HOST}/api/files/upload`, fd);
  };
}

export const fmFileService = new FMFileService();

export interface PostDataResponse {
  status: number;
  json?: any;
  error?: string;
}
async function postFormFetch(url = '', data: FormData): Promise<PostDataResponse> {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    redirect: 'error', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: data, // body data type must match "Content-Type" header
  });
  const res: PostDataResponse = {
    status: response.status,
  };
  if (res.status >= 200 && res.status < 300) {
    res.json = await response.json();
  } else {
    res.error = await response.text();
  }
  return res;
}
