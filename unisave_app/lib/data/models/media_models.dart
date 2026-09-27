import 'package:freezed_annotation/freezed_annotation.dart';

part 'media_models.freezed.dart';
part 'media_models.g.dart';

@freezed
class MediaFormat with _$MediaFormat {
  const factory MediaFormat({
    required String id,
    required String type, // "video" | "audio"
    required String format, // "mp4", "m4a", etc.
    String? quality,
    String? resolution,
    double? fps,
    int? fileSize,
    String? label,
    @Default(true) bool available,
    String? ytdlpFormatId,
  }) = _MediaFormat;

  factory MediaFormat.fromJson(Map<String, dynamic> json) =>
      _$MediaFormatFromJson(json);
}

@freezed
class MediaInfo with _$MediaInfo {
  const factory MediaInfo({
    required String platform,
    String? title,
    String? thumbnail,
    String? creator,
    int? duration,
    String? description,
    @Default(true) bool isPublic,
    String? watermarkNote,
  }) = _MediaInfo;

  factory MediaInfo.fromJson(Map<String, dynamic> json) =>
      _$MediaInfoFromJson(json);
}

@freezed
class AnalyzeResult with _$AnalyzeResult {
  const factory AnalyzeResult({
    required bool success,
    required String platform,
    required MediaInfo media,
    @Default([]) List<MediaFormat> formats,
    String? error,
    String? errorCode,
  }) = _AnalyzeResult;

  factory AnalyzeResult.fromJson(Map<String, dynamic> json) =>
      _$AnalyzeResultFromJson(json);
}

@freezed
class DownloadJobResponse with _$DownloadJobResponse {
  const factory DownloadJobResponse({
    required bool success,
    required String jobId,
    String? message,
    String? error,
    String? errorCode,
  }) = _DownloadJobResponse;

  factory DownloadJobResponse.fromJson(Map<String, dynamic> json) =>
      _$DownloadJobResponseFromJson(json);
}

@freezed
class JobStatusResponse with _$JobStatusResponse {
  const factory JobStatusResponse({
    required String id,
    required String status, // pending, processing, completed, failed, expired
    double? progress,
    String? downloadUrl,
    String? fileName,
    String? error,
  }) = _JobStatusResponse;

  factory JobStatusResponse.fromJson(Map<String, dynamic> json) =>
      _$JobStatusResponseFromJson(json);
}
