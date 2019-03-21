import { isAndroid } from 'tns-core-modules/platform';

export enum VideoEditorActions {
    TRANSCODE = 'transcode',
    CREATETHUMBNAIL = 'createThumbnail',
    GETVIDEOINFO = 'getVideoInfo'
}

export class VideoEditor {

    private static _worker: Worker;
    private static _logCallback: Function;
    private static _statisticsCallback: Function;

    public static get worker(): Worker {
        if (!this._worker) {
            // @ts-ignore
            if (global['TNS_WEBPACK']) {
                // @ts-ignore
                const FFmpegWorker = require('nativescript-worker-loader!./worker');
                this._worker = new FFmpegWorker();
            } else {
                this._worker = new Worker('./worker');
            }

            this._worker.onmessage = msg => {
                const id = msg.data.id;
                const action = msg.data.action;
                const status: 'success' | 'error' = msg.data.status;
                const result = msg.data.result;
                const callback = this.callbackMap.get(id);
                if (callback) {
                    if (status === 'success') {
                        switch (action) {
                            case VideoEditorActions.TRANSCODE:
                                if (msg.data.isProgress) {
                                    const progressCallback = callback.progressCallback;
                                    if (progressCallback) {
                                        progressCallback(result);
                                    }
                                } else {
                                    callback.resolve(result);
                                    this.callbackMap.delete(id);
                                }
                                break;
                            case VideoEditorActions.GETVIDEOINFO:
                                callback.resolve(result);
                                this.callbackMap.delete(id);
                                break;
                            case VideoEditorActions.CREATETHUMBNAIL:
                                callback.resolve(result);
                                this.callbackMap.delete(id);
                                break;
                            default:
                                break;
                        }
                    } else {
                        callback.reject(result);
                    }
                }
            };

            this._worker.onerror = error => {
                console.error(error);
            };
        }
        return this._worker;
    }

    private static callbackMap: Map<string, { resolve: any, reject: any, progressCallback?: any }> = new Map();


    private static getUUID(): string {
        if (isAndroid) {
            return java.util.UUID.randomUUID().toString();
        } else {
            return NSUUID.UUID().UUIDString;
        }
    }

    public static transcodeVideo(source: string, outputFileName: string, bitRate: number, frameRate: number, width: number, height: number, saveToLibrary: boolean = false, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            const id = this.getUUID();
            this.callbackMap.set(id, {resolve, reject, progressCallback: callback});
            this.worker.postMessage({
                id,
                action: VideoEditorActions.TRANSCODE,
                source,
                outputFileName,
                bitRate,
                frameRate,
                width,
                height,
                saveToLibrary
            });
        });
    }

    public static createThumbnail(source: string,
                                  outputFileName: string,
                                  atTime: number,
                                  width: number,
                                  height: number,
                                  quality: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const id = this.getUUID();
            this.callbackMap.set(id, {resolve, reject});
            this.worker.postMessage({
                id,
                action: VideoEditorActions.CREATETHUMBNAIL,
                source,
                outputFileName,
                atTime,
                width,
                height,
                quality
            });
        });
    }

    public static getVideoInfo(source: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const id = this.getUUID();
            this.callbackMap.set(id, {resolve, reject});
            this.worker.postMessage({
                id,
                action: VideoEditorActions.GETVIDEOINFO,
                source
            });
        });
    }
}
