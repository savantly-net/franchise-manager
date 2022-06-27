import { FileDataRequest, FileService } from '@savantly/sprout-api';
import { getFileService } from '@savantly/sprout-runtime';
import { API_HOST } from 'plugin/config/appModuleConfiguration';

class FMFileService implements FileService {
  getFilesByPath = (path?: string) => {
    return getFileService().getFilesByPath(path);
  };

  deleteFileByPath = (path?: string) => {
    return getFileService().deleteFileByPath(path);
  };

  createFile = (request: FileDataRequest) => {
    return postData(`${API_HOST}/api/files/create`, request, 'JSON');
  };

  uploadFile = (request: FileDataRequest, file: any) => {
    //const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const metaData = new Blob([JSON.stringify(request)], { type: 'application/json' });

    let fd = new FormData();
    fd.append('file', file);
    fd.append('metaData', metaData);
    console.log(fd);
    return postData(`${API_HOST}/api/files/upload`, fd, 'FORM');
  };
}

export const fmFileService = new FMFileService();

type PostDataType = 'JSON' | 'FORM';
async function postData(url = '', data: any, dataType: PostDataType) {
  let contentType = 'application/x-www-form-urlencoded';
  let body = data;
  if (dataType === 'JSON') {
    contentType = 'application/json';
    body = JSON.stringify(data);
  }
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': contentType,
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'error', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: body, // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
