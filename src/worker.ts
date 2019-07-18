import 'tns-core-modules/globals';
import { isAndroid } from 'tns-core-modules/platform';
import { VideoEditorActions } from './video-editor';
import * as fs from 'tns-core-modules/file-system';
import * as utils from 'tns-core-modules/utils/utils';

const context: Worker = self as any;

context.onmessage = msg => {
    switch (msg.data.action) {
        case VideoEditorActions.TRANSCODE:
            transcode(
                msg.data.id,
                msg.data.source,
                msg.data.outputFileName,
                msg.data.bitRate,
                msg.data.frameRate,
                msg.data.width,
                msg.data.height,
                msg.data.saveToGallery
            );
            break;
        case VideoEditorActions.CREATETHUMBNAIL:
            createThumbnail(
                msg.data.id,
                msg.data.source,
                msg.data.outputFileName,
                msg.data.atTime,
                msg.data.width,
                msg.data.height,
                msg.data.quality);
            break;
        case VideoEditorActions.GETVIDEOINFO:
            getVideoInfo(msg.data.id, msg.data.source);
            break;
        default:
            break;
    }
};

context.onerror = error => {
    console.error(error);
};

const transcode = (
    id: string,
    source: string,
    outputFileName: string,
    bitRate: number,
    frameRate: number,
    width: number,
    height: number,
    saveToLibrary: boolean
) => {
    if (isAndroid) {
        const instance = net.ypresto.androidtranscoder.MediaTranscoder.getInstance();
        const nativeFile = new java.io.File(source);
        const is = new java.io.FileInputStream(nativeFile);
        outputFileName = outputFileName || new java.text.SimpleDateFormat('yyyyMMdd_HHmmss', java.util.Locale.ENGLISH).format(new java.util.Date());
        let outputExtension = '.mp4';

        const pm = utils.ad.getApplicationContext().getPackageManager();
        let ai;
        try {
            ai = pm.getApplicationInfo(utils.ad.getApplicationContext().getPackageName(), 0);
        } catch (e) {
            ai = null;
        }

        const appName = (String)(ai !== null ? pm.getApplicationLabel(ai) : 'Unknown');


        let mediaStorageDir;

        if (saveToLibrary) {
            mediaStorageDir = new java.io.File(
                android.os.Environment.getExternalStorageDirectory() + '/Movies',
                appName
            );
        } else {
            mediaStorageDir = new java.io.File(android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + '/Android/data/' + utils.ad.getApplicationContext().getPackageName() + '/files/files/videos');
        }

        if (!mediaStorageDir.exists()) {
            if (!mediaStorageDir.mkdirs()) {
                context.postMessage({
                    id,
                    action: VideoEditorActions.TRANSCODE,
                    status: 'error',
                    result: 'Can\'t access or create Movies directory'
                });
                return;
            }
        }

        const outputFilePath = new java.io.File(
            mediaStorageDir.getPath(),
            outputFileName + outputExtension
        ).getAbsolutePath();


        const formatStrategy = (java as any).lang.Object.extend({
            interfaces: [net.ypresto.androidtranscoder.format.MediaFormatStrategy],
            DEFAULT_BITRATE: 8000000,
            DEFAULT_FRAMERATE: 30,
            DEFAULT_WIDTH: 0,
            DEFAULT_HEIGHT: 0,
            mBitRate: 0,
            mFrameRate: 0,
            width: 0,
            height: 0,
            init: function () {
            },
            createVideoOutputFormat: function (inputFormat) {
                let inWidth = inputFormat.getInteger(
                    android.media.MediaFormat.KEY_WIDTH
                );
                let inHeight = inputFormat.getInteger(
                    android.media.MediaFormat.KEY_HEIGHT
                );
                let inLonger, inShorter, outWidth, outHeight, outLonger;
                let aspectRatio;

                if (this.width >= this.height) {
                    outLonger = this.width;
                } else {
                    outLonger = this.height;
                }

                if (inWidth >= inHeight) {
                    inLonger = inWidth;
                    inShorter = inHeight;
                } else {
                    inLonger = inHeight;
                    inShorter = inWidth;
                }

                if (inLonger > outLonger && outLonger > 0) {
                    if (inWidth >= inHeight) {
                        aspectRatio = inLonger / inShorter;
                        outWidth = outLonger;
                        outHeight = outWidth / aspectRatio;
                    } else {
                        aspectRatio = inLonger / inShorter;
                        outHeight = outLonger;
                        outWidth = outHeight / aspectRatio;
                    }
                } else {
                    outWidth = inWidth;
                    outHeight = inHeight;
                }

                const format = android.media.MediaFormat.createVideoFormat(
                    'video/avc',
                    outWidth,
                    outHeight
                );
                format.setInteger(
                    android.media.MediaFormat.KEY_BIT_RATE,
                    this.mBitRate
                );
                format.setInteger(
                    android.media.MediaFormat.KEY_FRAME_RATE,
                    this.mFrameRate
                );
                format.setInteger(android.media.MediaFormat.KEY_I_FRAME_INTERVAL, 3);
                format.setInteger(
                    android.media.MediaFormat.KEY_COLOR_FORMAT,
                    (android as any).media.MediaCodecInfo.CodecCapabilities
                        .COLOR_FormatSurface
                );

                return format;
            },
            createAudioOutputFormat: function (inputFormat) {
                return null;
            }
        });
        const strategy = new formatStrategy();
        strategy.bitRate = bitRate;
        strategy.frameRate = frameRate;
        strategy.width = width;
        strategy.height = height;
        instance.transcodeVideo(
            is.getFD(),
            outputFilePath,
            strategy,
            new net.ypresto.androidtranscoder.MediaTranscoder.Listener({
                onTranscodeCanceled(): void {
                    context.postMessage({
                        id,
                        action: VideoEditorActions.TRANSCODE,
                        status: 'error',
                        result: 'transcode canceled'
                    });
                },
                onTranscodeCompleted(): void {

                    const outFile = new java.io.File(outputFilePath);
                    if (!outFile.exists()) {
                        context.postMessage({
                            id,
                            action: VideoEditorActions.TRANSCODE,
                            status: 'error',
                            result: 'An error ocurred during transcoding'
                        });
                        return;
                    }

                    // make the gallery display the new file if saving to library
                    if (saveToLibrary) {
                        const scanIntent = new android.content.Intent(android.content.Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
                        scanIntent.setData(android.net.Uri.fromFile(nativeFile));
                        scanIntent.setData(android.net.Uri.fromFile(outFile));
                        utils.ad.getApplicationContext().sendBroadcast(scanIntent);
                    }

                    context.postMessage({
                        id,
                        action: VideoEditorActions.TRANSCODE,
                        status: 'success',
                        result: outFile.getAbsolutePath()
                    });
                },
                onTranscodeFailed(exception: java.lang.Exception): void {
                    context.postMessage({
                        id,
                        action: VideoEditorActions.TRANSCODE,
                        status: 'error',
                        result: exception.getMessage()
                    });
                },
                onTranscodeProgress(progress: number): void {
                    context.postMessage({
                        id,
                        action: VideoEditorActions.TRANSCODE,
                        status: 'success',
                        result: progress,
                        isProgress: true
                    });
                }
            })
        );
    } else {

        try {
            let outputExtension = 'mp4';
            const inputFile = NSURL.fileURLWithPath(source.replace('file://', ''));
            // check if the video can be saved to photo album before going further
            if (saveToLibrary && !UIVideoAtPathIsCompatibleWithSavedPhotosAlbum(inputFile.path)) {
                context.postMessage({
                    id,
                    action: VideoEditorActions.TRANSCODE,
                    status: 'error',
                    result: 'Video cannot be saved to photo album'
                });
                return;
            }

            const asset = AVURLAsset.assetWithURL(
                inputFile
            );

            const cacheDir = NSSearchPathForDirectoriesInDomains(NSSearchPathDirectory.CachesDirectory, NSSearchPathDomainMask.UserDomainMask, true).objectAtIndex(0);
            let outputPath = NSString.stringWithString(cacheDir);
            outputPath = NSString.stringWithString(outputPath.stringByAppendingPathComponent(outputFileName));
            outputPath = NSString.stringWithString(outputPath.stringByAppendingPathExtension(outputExtension));
            const outputURL = NSURL.fileURLWithPath(outputPath as any);

            const session = AVAssetExportSession.alloc().initWithAssetPresetName(
                asset,
                AVAssetExportPresetHighestQuality
            );
            let videoComposition = AVMutableVideoComposition.videoCompositionWithPropertiesOfAsset(
                asset
            ) as AVMutableVideoComposition;
            videoComposition.renderSize = CGSizeMake(width, height);
            videoComposition.frameDuration = CMTimeMake(1, frameRate);
            session.videoComposition = videoComposition;
            session.outputURL = outputURL;
            session.outputFileType = AVFileTypeMPEG4;
            let interval = setInterval(() => {
                switch (session.status) {
                    case AVAssetExportSessionStatus.Exporting:
                        context.postMessage({
                            id,
                            action: VideoEditorActions.TRANSCODE,
                            status: 'success',
                            result: session.progress,
                            isProgress: true
                        });
                        break;
                    default:
                        break;
                }
            }, 1000);
            session.exportAsynchronouslyWithCompletionHandler(() => {
                switch (session.status) {
                    case AVAssetExportSessionStatus.Completed:
                        clearInterval(interval);

                        context.postMessage({
                            id,
                            action: VideoEditorActions.TRANSCODE,
                            status: 'success',
                            result: 1.0,
                            isProgress: true
                        });

                        if (saveToLibrary) {
                            UISaveVideoAtPathToSavedPhotosAlbum(outputPath as any, self, null, null);
                        }
                        context.postMessage({
                            id,
                            action: VideoEditorActions.TRANSCODE,
                            status: 'success',
                            result: outputURL.path
                        });

                        break;
                    case AVAssetExportSessionStatus.Failed:
                        clearInterval(interval);
                        context.postMessage({
                            id,
                            action: VideoEditorActions.TRANSCODE,
                            status: 'error',
                            result: session.error ? session.error.localizedDescription : ''
                        });
                        break;
                    case AVAssetExportSessionStatus.Cancelled:
                        clearInterval(interval);
                        context.postMessage({
                            id,
                            action: VideoEditorActions.TRANSCODE,
                            status: 'error',
                            result: 'transcode canceled'
                        });
                        break;
                    default:
                        break;
                }
            });
        } catch (e) {
            console.log('transcode ', e);
        }
    }
};

const createThumbnail = (
    id: string,
    source: string,
    outputFileName: string,
    atTime: number,
    width: number,
    height: number,
    quality: number
) => {
    if (isAndroid) {

        const inFile = new java.io.File(source);
        if (!inFile.exists()) {
            return;
        }
        const srcVideoPath = inFile.getAbsolutePath();

        atTime = (atTime === 0) ? 0 : atTime * 1000000;

        const appContext = utils.ad.getApplicationContext();
        const pm = appContext.getPackageManager();

        let ai;
        try {
            ai = pm.getApplicationInfo(utils.ad.getApplicationContext().getPackageName(), 0);
        } catch (e) {
            ai = null;
        }
        const appName = (String)(ai != null ? pm.getApplicationLabel(ai) : 'Unknown');

        const externalFilesDir = new java.io.File(android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + '/Android/data/' + utils.ad.getApplicationContext().getPackageName() + '/files/files/videos');

        if (!externalFilesDir.exists()) {
            if (!externalFilesDir.mkdirs()) {
                context.postMessage({
                    id,
                    action: VideoEditorActions.CREATETHUMBNAIL,
                    status: 'error',
                    result: 'Can\'t access or create Movies directory'
                });
                return;
            }
        }

        const outputFile = new java.io.File(
            externalFilesDir.getPath(),
            outputFileName + '.jpg'
        );

        const outputFilePath = outputFile.getAbsolutePath();


        let outStream = null;

        try {
            let mmr = new android.media.MediaMetadataRetriever();
            mmr.setDataSource(srcVideoPath);

            let bitmap = mmr.getFrameAtTime(atTime);

            if (width > 0 || height > 0) {
                const videoWidth = bitmap.getWidth();
                const videoHeight = bitmap.getHeight();
                const aspectRatio = videoWidth / videoHeight;

                const scaleWidth = java.lang.Double.valueOf(height * aspectRatio).intValue();
                const scaleHeight = java.lang.Double.valueOf(scaleWidth / aspectRatio).intValue();

                const resizedBitmap = android.graphics.Bitmap.createScaledBitmap(bitmap, scaleWidth, scaleHeight, false);
                bitmap.recycle();
                bitmap = resizedBitmap;
            }

            outStream = new java.io.FileOutputStream(outputFile);
            bitmap.compress(android.graphics.Bitmap.CompressFormat.JPEG, quality, outStream);

            context.postMessage({
                id,
                action: VideoEditorActions.CREATETHUMBNAIL,
                status: 'success',
                result: outputFilePath
            });

        } catch (e) {
            if (outStream != null) {
                try {
                    outStream.close();
                } catch (e1) {
                    e1.printStackTrace();
                }
            }
            context.postMessage({
                id,
                action: VideoEditorActions.CREATETHUMBNAIL,
                status: 'error',
                result: e.toString()
            });
        }

    } else {
        const srcVideoPath = source;
        const thumbQuality = (quality * 1.0) / 100;

        const preferredTimeScale = 600;
        const time = CMTimeMakeWithSeconds(atTime, preferredTimeScale);

        let thumbnail = generateThumbnailImage(srcVideoPath, time);

        if (!thumbnail) {
            context.postMessage({
                id,
                action: VideoEditorActions.CREATETHUMBNAIL,
                status: 'error',
                result: 'failed to create thumbnail file'
            });
            return;
        }
        if (width && height) {
            const newSize = CGSizeMake(width, height);
            thumbnail = scaleImage(thumbnail, newSize);
        }
        const cacheDir = NSSearchPathForDirectoriesInDomains(NSSearchPathDirectory.CachesDirectory, NSSearchPathDomainMask.UserDomainMask, true).objectAtIndex(0);

        let outputPath = NSString.stringWithString(cacheDir);
        outputPath = NSString.stringWithString(outputPath.stringByAppendingPathComponent(outputFileName));
        outputPath = NSString.stringWithString(outputPath.stringByAppendingPathExtension('jpg'));
        const outputFilePath = NSURL.fileURLWithPath(outputPath as any);

        if (
            UIImageJPEGRepresentation(thumbnail, thumbQuality).writeToFileAtomically(
                outputFilePath.path as any,
                true
            )
        ) {
            context.postMessage({
                id,
                action: VideoEditorActions.CREATETHUMBNAIL,
                status: 'success',
                result: outputFilePath.path
            });
        } else {
            context.postMessage({
                id,
                action: VideoEditorActions.CREATETHUMBNAIL,
                status: 'error',
                result: 'failed to create thumbnail file'
            });
        }
    }
};

const getVideoInfo = (id: string, source: string) => {
    if (isAndroid) {
        const inFile = new java.io.File(source);
        if (!inFile.exists()) {
            context.postMessage({
                id,
                action: VideoEditorActions.GETVIDEOINFO,
                status: 'error',
                result: 'File doesn\'t exist'
            });
            return;
        }
        const size = inFile.length();

        const videoSrcPath = inFile.getAbsolutePath();
        const mmr = new android.media.MediaMetadataRetriever();
        mmr.setDataSource(videoSrcPath);
        let videoWidth = parseFloat(
            mmr.extractMetadata(
                android.media.MediaMetadataRetriever.METADATA_KEY_VIDEO_WIDTH
            )
        );
        let videoHeight = parseFloat(
            mmr.extractMetadata(
                android.media.MediaMetadataRetriever.METADATA_KEY_VIDEO_HEIGHT
            )
        );

        let orientation;
        const mmrOrientation = mmr.extractMetadata(
            android.media.MediaMetadataRetriever.METADATA_KEY_VIDEO_ROTATION
        );

        if (videoWidth < videoHeight) {
            if (mmrOrientation === '0' || mmrOrientation === '180') {
                orientation = 'portrait';
            } else {
                orientation = 'landscape';
            }
        } else {
            if (mmrOrientation === '0' || mmrOrientation === '180') {
                orientation = 'landscape';
            } else {
                orientation = 'portrait';
            }
        }

        const duration =
            java.lang.Double.parseDouble(
                mmr.extractMetadata(
                    android.media.MediaMetadataRetriever.METADATA_KEY_DURATION
                )
            ) / 1000.0;
        const bitrate = java.lang.Long.parseLong(
            mmr.extractMetadata(
                android.media.MediaMetadataRetriever.METADATA_KEY_BITRATE
            )
        );

        const response = {
            width: videoWidth,
            height: videoHeight,
            orientation,
            duration,
            size,
            bitrate
        };

        context.postMessage({
            id,
            action: VideoEditorActions.GETVIDEOINFO,
            status: 'success',
            result: response
        });
    } else {
        const fileURL = NSURL.fileURLWithPath(source);

        const file = fs.File.fromPath(source);
        const size = file ? file.size : 0;
        const avAsset = AVURLAsset.assetWithURL(fileURL);

        const tracks = avAsset.tracksWithMediaType(AVMediaTypeVideo);
        const track = tracks.objectAtIndex(0);
        const mediaSize = track.naturalSize;

        let videoWidth = mediaSize.width;
        let videoHeight = mediaSize.height;
        let aspectRatio = videoWidth / videoHeight;

        const videoOrientation = getOrientationForTrack(avAsset);
        if (videoOrientation === 'portrait') {
            if (videoWidth > videoHeight) {
                videoWidth = mediaSize.width;
                videoHeight = mediaSize.height;
                aspectRatio = videoWidth / videoHeight;
            }
        }

        const dict = {
            width: videoWidth,
            height: videoHeight,
            orientation: videoOrientation,
            duration: track.timeRange.duration.value / 600.0,
            size,
            bitrate: track.estimatedDataRate
        };

        context.postMessage({
            id,
            action: VideoEditorActions.GETVIDEOINFO,
            status: 'success',
            result: dict
        });
    }
};

const getOrientationForTrack = (asset: AVURLAsset) => {
    const videoTrack = asset
        .tracksWithMediaType(AVMediaTypeVideo)
        .objectAtIndex(0);
    const size = videoTrack.naturalSize;
    const txf = videoTrack.preferredTransform;

    if (size.width === txf.tx && size.height === txf.ty) {
        return 'landscape';
    } else if (txf.tx === 0 && txf.ty === 0) {
        return 'landscape';
    } else if (txf.tx === 0 && txf.ty === size.width) {
        return 'portrait';
    } else {
        return 'portrait';
    }
};

const generateThumbnailImage = (srcVideoPath: string, time: CMTime) => {
    try {
        const url = NSURL.fileURLWithPath(srcVideoPath.replace('file://', ''));
        const asset = AVAsset.assetWithURL(url);
        const imageGenerator = AVAssetImageGenerator.alloc().initWithAsset(asset);
        imageGenerator.requestedTimeToleranceAfter = kCMTimeZero; // needed to get a precise time (http://stackoverflow.com/questions/5825990/i-cannot-get-a-precise-cmtime-for-generating-still-image-from-1-8-second-video)
        imageGenerator.requestedTimeToleranceBefore = kCMTimeZero; // ^^
        imageGenerator.appliesPreferredTrackTransform = true; // crucial to have the right orientation for the image (http://stackoverflow.com/questions/9145968/getting-video-snapshot-for-thumbnail)
        const imageRef = imageGenerator.copyCGImageAtTimeActualTimeError(
            time,
            null
        );
        const thumbnail = UIImage.imageWithCGImage(imageRef);

        CGImageRelease(imageRef); // CGImageRef won't be released by ARC

        return thumbnail;
    } catch (e) {
        console.error('generateThumbnailImage ', e.message);
        return null;
    }
};

// to scale images without changing aspect ratio (http://stackoverflow.com/a/8224161/1673842)
const scaleImage = (image: UIImage, newSize: CGSize) => {
    let oldWidth = image.size.width;
    let scaleFactor = newSize.width / oldWidth;

    let newHeight = image.size.height * scaleFactor;
    let newWidth = oldWidth * scaleFactor;

    UIGraphicsBeginImageContext(CGSizeMake(newWidth, newHeight));
    image.drawInRect(CGRectMake(0, 0, newWidth, newHeight));
    const newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return newImage;
};
