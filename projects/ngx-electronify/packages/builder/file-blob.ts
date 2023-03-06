export interface FileBlob {
    path: string;
    data: Buffer;
    contentType: string;
}

export interface FileBlobRx {
    path: string;
    data: Uint8Array;
    contentType: string;
}
