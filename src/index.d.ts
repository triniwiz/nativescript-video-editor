export declare class VideoEditor {
    static transcodeVideo(source: string, outputFileName: string, bitRate: number, frameRate: number, width: number, height: number, saveToLibrary?: boolean, callback?: Function): Promise<any>;
    static createThumbnail(source: string, outputFileName: string, atTime: number, width: number, height: number, quality: number): Promise<any>;
    static getVideoInfo(source: string): Promise<any>;
}
