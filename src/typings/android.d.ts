// <reference path="../node_modules/tns-platform-declarations/android.d.ts" />

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export class BuildConfig {
				public static class: java.lang.Class<net.ypresto.androidtranscoder.BuildConfig>;
				public static DEBUG: boolean;
				public static APPLICATION_ID: string;
				public static BUILD_TYPE: string;
				public static FLAVOR: string;
				public static VERSION_CODE: number;
				public static VERSION_NAME: string;
				public constructor();
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export class MediaTranscoder {
				public static class: java.lang.Class<net.ypresto.androidtranscoder.MediaTranscoder>;
				public transcodeVideo(param0: java.io.FileDescriptor, param1: string, param2: net.ypresto.androidtranscoder.MediaTranscoder.Listener): java.util.concurrent.Future<java.lang.Void>;
				public transcodeVideo(param0: string, param1: string, param2: net.ypresto.androidtranscoder.format.MediaFormatStrategy, param3: net.ypresto.androidtranscoder.MediaTranscoder.Listener): java.util.concurrent.Future<java.lang.Void>;
				public transcodeVideo(param0: java.io.FileDescriptor, param1: string, param2: net.ypresto.androidtranscoder.format.MediaFormatStrategy, param3: net.ypresto.androidtranscoder.MediaTranscoder.Listener): java.util.concurrent.Future<java.lang.Void>;
				public static getInstance(): net.ypresto.androidtranscoder.MediaTranscoder;
			}
			export module MediaTranscoder {
				export class Listener {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.MediaTranscoder.Listener>;
					/**
					 * Constructs a new instance of the net.ypresto.androidtranscoder.MediaTranscoder$Listener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onTranscodeProgress(param0: number): void;
						onTranscodeCompleted(): void;
						onTranscodeCanceled(): void;
						onTranscodeFailed(param0: java.lang.Exception): void;
					});
					public constructor();
					public onTranscodeCompleted(): void;
					public onTranscodeProgress(param0: number): void;
					public onTranscodeFailed(param0: java.lang.Exception): void;
					public onTranscodeCanceled(): void;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module compat {
				export class MediaCodecBufferCompatWrapper {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.compat.MediaCodecBufferCompatWrapper>;
					public getOutputBuffer(param0: number): java.nio.ByteBuffer;
					public constructor(param0: globalAndroid.media.MediaCodec);
					public getInputBuffer(param0: number): java.nio.ByteBuffer;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module compat {
				export class MediaCodecListCompat {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.compat.MediaCodecListCompat>;
					public static REGULAR_CODECS: number;
					public static ALL_CODECS: number;
					public findEncoderForFormat(param0: globalAndroid.media.MediaFormat): string;
					public getCodecInfos(): native.Array<globalAndroid.media.MediaCodecInfo>;
					public constructor(param0: number);
					public findDecoderForFormat(param0: globalAndroid.media.MediaFormat): string;
				}
				export module MediaCodecListCompat {
					export class MediaCodecInfoIterator extends java.util.Iterator<globalAndroid.media.MediaCodecInfo> {
						public static class: java.lang.Class<net.ypresto.androidtranscoder.compat.MediaCodecListCompat.MediaCodecInfoIterator>;
						public next(): globalAndroid.media.MediaCodecInfo;
						public hasNext(): boolean;
						public remove(): void;
					}
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module engine {
				export class AudioChannel {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.AudioChannel>;
					public static BUFFER_INDEX_END_OF_STREAM: number;
					public drainDecoderBufferAndQueue(param0: number, param1: number): void;
					public feedEncoder(param0: number): boolean;
					public setActualDecodedFormat(param0: globalAndroid.media.MediaFormat): void;
					public constructor(param0: globalAndroid.media.MediaCodec, param1: globalAndroid.media.MediaCodec, param2: globalAndroid.media.MediaFormat);
				}
				export module AudioChannel {
					export class AudioBuffer {
						public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.AudioChannel.AudioBuffer>;
					}
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module engine {
				export class AudioRemixer {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.AudioRemixer>;
					/**
					 * Constructs a new instance of the net.ypresto.androidtranscoder.engine.AudioRemixer interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						remix(param0: java.nio.ShortBuffer, param1: java.nio.ShortBuffer): void;
						<clinit>(): void;
					});
					public constructor();
					public static DOWNMIX: net.ypresto.androidtranscoder.engine.AudioRemixer;
					public static PASSTHROUGH: net.ypresto.androidtranscoder.engine.AudioRemixer;
					public static UPMIX: net.ypresto.androidtranscoder.engine.AudioRemixer;
					public remix(param0: java.nio.ShortBuffer, param1: java.nio.ShortBuffer): void;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module engine {
				export class AudioTrackTranscoder extends net.ypresto.androidtranscoder.engine.TrackTranscoder {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.AudioTrackTranscoder>;
					public getDeterminedFormat(): globalAndroid.media.MediaFormat;
					public isFinished(): boolean;
					public constructor(param0: globalAndroid.media.MediaExtractor, param1: number, param2: globalAndroid.media.MediaFormat, param3: net.ypresto.androidtranscoder.engine.QueuedMuxer);
					public setup(): void;
					public getWrittenPresentationTimeUs(): number;
					public stepPipeline(): boolean;
					public release(): void;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module engine {
				export class InputSurface {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.InputSurface>;
					public swapBuffers(): boolean;
					public getHeight(): number;
					public makeCurrent(): void;
					public makeUnCurrent(): void;
					public getWidth(): number;
					public constructor(param0: globalAndroid.view.Surface);
					public release(): void;
					public getSurface(): globalAndroid.view.Surface;
					public setPresentationTime(param0: number): void;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module engine {
				export class InvalidOutputFormatException {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.InvalidOutputFormatException>;
					public constructor(param0: string);
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module engine {
				export class MediaFormatValidator {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.MediaFormatValidator>;
					public static validateAudioOutputFormat(param0: globalAndroid.media.MediaFormat): void;
					public static validateVideoOutputFormat(param0: globalAndroid.media.MediaFormat): void;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module engine {
				export class MediaTranscoderEngine {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.MediaTranscoderEngine>;
					public getProgress(): number;
					public transcodeVideo(param0: string, param1: net.ypresto.androidtranscoder.format.MediaFormatStrategy): void;
					public setDataSource(param0: java.io.FileDescriptor): void;
					public constructor();
					public getProgressCallback(): net.ypresto.androidtranscoder.engine.MediaTranscoderEngine.ProgressCallback;
					public setProgressCallback(param0: net.ypresto.androidtranscoder.engine.MediaTranscoderEngine.ProgressCallback): void;
				}
				export module MediaTranscoderEngine {
					export class ProgressCallback {
						public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.MediaTranscoderEngine.ProgressCallback>;
						/**
						 * Constructs a new instance of the net.ypresto.androidtranscoder.engine.MediaTranscoderEngine$ProgressCallback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							onProgress(param0: number): void;
						});
						public constructor();
						public onProgress(param0: number): void;
					}
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module engine {
				export class OutputSurface {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.OutputSurface>;
					public onFrameAvailable(param0: globalAndroid.graphics.SurfaceTexture): void;
					public changeFragmentShader(param0: string): void;
					public checkForNewImage(param0: number): boolean;
					public constructor();
					public makeCurrent(): void;
					public awaitNewImage(): void;
					public release(): void;
					public getSurface(): globalAndroid.view.Surface;
					public drawImage(): void;
					public constructor(param0: number, param1: number);
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module engine {
				export class PassThroughTrackTranscoder extends net.ypresto.androidtranscoder.engine.TrackTranscoder {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.PassThroughTrackTranscoder>;
					public getDeterminedFormat(): globalAndroid.media.MediaFormat;
					public isFinished(): boolean;
					public setup(): void;
					public getWrittenPresentationTimeUs(): number;
					public constructor(param0: globalAndroid.media.MediaExtractor, param1: number, param2: net.ypresto.androidtranscoder.engine.QueuedMuxer, param3: net.ypresto.androidtranscoder.engine.QueuedMuxer.SampleType);
					public stepPipeline(): boolean;
					public release(): void;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module engine {
				export class QueuedMuxer {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.QueuedMuxer>;
					public setOutputFormat(param0: net.ypresto.androidtranscoder.engine.QueuedMuxer.SampleType, param1: globalAndroid.media.MediaFormat): void;
					public writeSampleData(param0: net.ypresto.androidtranscoder.engine.QueuedMuxer.SampleType, param1: java.nio.ByteBuffer, param2: globalAndroid.media.MediaCodec.BufferInfo): void;
					public constructor(param0: globalAndroid.media.MediaMuxer, param1: net.ypresto.androidtranscoder.engine.QueuedMuxer.Listener);
				}
				export module QueuedMuxer {
					export class Listener {
						public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.QueuedMuxer.Listener>;
						/**
						 * Constructs a new instance of the net.ypresto.androidtranscoder.engine.QueuedMuxer$Listener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							onDetermineOutputFormat(): void;
						});
						public constructor();
						public onDetermineOutputFormat(): void;
					}
					export class SampleInfo {
						public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.QueuedMuxer.SampleInfo>;
					}
					export class SampleType {
						public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.QueuedMuxer.SampleType>;
						public static VIDEO: net.ypresto.androidtranscoder.engine.QueuedMuxer.SampleType;
						public static AUDIO: net.ypresto.androidtranscoder.engine.QueuedMuxer.SampleType;
						public static valueOf(param0: string): net.ypresto.androidtranscoder.engine.QueuedMuxer.SampleType;
						public static values(): native.Array<net.ypresto.androidtranscoder.engine.QueuedMuxer.SampleType>;
					}
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module engine {
				export class TextureRender {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.TextureRender>;
					public static saveFrame(param0: string, param1: number, param2: number): void;
					public drawFrame(param0: globalAndroid.graphics.SurfaceTexture): void;
					public changeFragmentShader(param0: string): void;
					public surfaceCreated(): void;
					public constructor();
					public getTextureId(): number;
					public checkGlError(param0: string): void;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module engine {
				export class TrackTranscoder {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.TrackTranscoder>;
					/**
					 * Constructs a new instance of the net.ypresto.androidtranscoder.engine.TrackTranscoder interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						setup(): void;
						getDeterminedFormat(): globalAndroid.media.MediaFormat;
						stepPipeline(): boolean;
						getWrittenPresentationTimeUs(): number;
						isFinished(): boolean;
						release(): void;
					});
					public constructor();
					public getDeterminedFormat(): globalAndroid.media.MediaFormat;
					public isFinished(): boolean;
					public setup(): void;
					public getWrittenPresentationTimeUs(): number;
					public stepPipeline(): boolean;
					public release(): void;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module engine {
				export class VideoTrackTranscoder extends net.ypresto.androidtranscoder.engine.TrackTranscoder {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.engine.VideoTrackTranscoder>;
					public getDeterminedFormat(): globalAndroid.media.MediaFormat;
					public isFinished(): boolean;
					public constructor(param0: globalAndroid.media.MediaExtractor, param1: number, param2: globalAndroid.media.MediaFormat, param3: net.ypresto.androidtranscoder.engine.QueuedMuxer);
					public setup(): void;
					public getWrittenPresentationTimeUs(): number;
					public stepPipeline(): boolean;
					public release(): void;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module format {
				export class Android16By9FormatStrategy extends net.ypresto.androidtranscoder.format.MediaFormatStrategy {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.format.Android16By9FormatStrategy>;
					public static AUDIO_BITRATE_AS_IS: number;
					public static AUDIO_CHANNELS_AS_IS: number;
					public static SCALE_720P: number;
					public constructor(param0: number, param1: number, param2: number, param3: number);
					public createAudioOutputFormat(param0: globalAndroid.media.MediaFormat): globalAndroid.media.MediaFormat;
					public createVideoOutputFormat(param0: globalAndroid.media.MediaFormat): globalAndroid.media.MediaFormat;
					public constructor(param0: number, param1: number);
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module format {
				export class Android720pFormatStrategy extends net.ypresto.androidtranscoder.format.MediaFormatStrategy {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.format.Android720pFormatStrategy>;
					public static AUDIO_BITRATE_AS_IS: number;
					public static AUDIO_CHANNELS_AS_IS: number;
					public constructor();
					public constructor(param0: number, param1: number, param2: number);
					public createAudioOutputFormat(param0: globalAndroid.media.MediaFormat): globalAndroid.media.MediaFormat;
					public constructor(param0: number);
					public createVideoOutputFormat(param0: globalAndroid.media.MediaFormat): globalAndroid.media.MediaFormat;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module format {
				export class ExportPreset960x540Strategy extends net.ypresto.androidtranscoder.format.MediaFormatStrategy {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.format.ExportPreset960x540Strategy>;
					public createAudioOutputFormat(param0: globalAndroid.media.MediaFormat): globalAndroid.media.MediaFormat;
					public createVideoOutputFormat(param0: globalAndroid.media.MediaFormat): globalAndroid.media.MediaFormat;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module format {
				export class MediaFormatExtraConstants {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.format.MediaFormatExtraConstants>;
					public static KEY_PROFILE: string;
					public static KEY_LEVEL: string;
					public static KEY_AVC_SPS: string;
					public static KEY_AVC_PPS: string;
					public static KEY_ROTATION_DEGREES: string;
					public static MIMETYPE_VIDEO_AVC: string;
					public static MIMETYPE_VIDEO_H263: string;
					public static MIMETYPE_VIDEO_VP8: string;
					public static MIMETYPE_AUDIO_AAC: string;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module format {
				export class MediaFormatPresets {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.format.MediaFormatPresets>;
					public static getExportPreset960x540(): globalAndroid.media.MediaFormat;
					public static getExportPreset960x540(param0: number, param1: number): globalAndroid.media.MediaFormat;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module format {
				export class MediaFormatStrategy {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.format.MediaFormatStrategy>;
					/**
					 * Constructs a new instance of the net.ypresto.androidtranscoder.format.MediaFormatStrategy interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						createVideoOutputFormat(param0: globalAndroid.media.MediaFormat): globalAndroid.media.MediaFormat;
						createAudioOutputFormat(param0: globalAndroid.media.MediaFormat): globalAndroid.media.MediaFormat;
					});
					public constructor();
					public createAudioOutputFormat(param0: globalAndroid.media.MediaFormat): globalAndroid.media.MediaFormat;
					public createVideoOutputFormat(param0: globalAndroid.media.MediaFormat): globalAndroid.media.MediaFormat;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module format {
				export class MediaFormatStrategyPresets {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.format.MediaFormatStrategyPresets>;
					public static AUDIO_BITRATE_AS_IS: number;
					public static AUDIO_CHANNELS_AS_IS: number;
					public static EXPORT_PRESET_960x540: net.ypresto.androidtranscoder.format.MediaFormatStrategy;
					public static createExportPreset960x540Strategy(): net.ypresto.androidtranscoder.format.MediaFormatStrategy;
					public static createAndroid720pStrategy(param0: number): net.ypresto.androidtranscoder.format.MediaFormatStrategy;
					public static createAndroid720pStrategy(param0: number, param1: number, param2: number): net.ypresto.androidtranscoder.format.MediaFormatStrategy;
					public static createAndroid720pStrategy(): net.ypresto.androidtranscoder.format.MediaFormatStrategy;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module format {
				export class OutputFormatUnavailableException {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.format.OutputFormatUnavailableException>;
					public constructor(param0: string);
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module utils {
				export class AvcCsdUtils {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.utils.AvcCsdUtils>;
					public static getSpsBuffer(param0: globalAndroid.media.MediaFormat): java.nio.ByteBuffer;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module utils {
				export class AvcSpsUtils {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.utils.AvcSpsUtils>;
					public constructor();
					public static getProfileIdc(param0: java.nio.ByteBuffer): number;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module utils {
				export class ISO6709LocationParser {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.utils.ISO6709LocationParser>;
					public constructor();
					public parse(param0: string): native.Array<number>;
				}
			}
		}
	}
}

declare module net {
	export module ypresto {
		export module androidtranscoder {
			export module utils {
				export class MediaExtractorUtils {
					public static class: java.lang.Class<net.ypresto.androidtranscoder.utils.MediaExtractorUtils>;
					public static getFirstVideoAndAudioTrack(param0: globalAndroid.media.MediaExtractor): net.ypresto.androidtranscoder.utils.MediaExtractorUtils.TrackResult;
				}
				export module MediaExtractorUtils {
					export class TrackResult {
						public static class: java.lang.Class<net.ypresto.androidtranscoder.utils.MediaExtractorUtils.TrackResult>;
						public mVideoTrackIndex: number;
						public mVideoTrackMime: string;
						public mVideoTrackFormat: globalAndroid.media.MediaFormat;
						public mAudioTrackIndex: number;
						public mAudioTrackMime: string;
						public mAudioTrackFormat: globalAndroid.media.MediaFormat;
					}
				}
			}
		}
	}
}

//Generics information:

