// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'media_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$MediaFormatImpl _$$MediaFormatImplFromJson(Map<String, dynamic> json) =>
    _$MediaFormatImpl(
      id: json['id'] as String,
      type: json['type'] as String,
      format: json['format'] as String,
      quality: json['quality'] as String?,
      resolution: json['resolution'] as String?,
      fps: (json['fps'] as num?)?.toDouble(),
      fileSize: (json['fileSize'] as num?)?.toInt(),
      label: json['label'] as String?,
      available: json['available'] as bool? ?? true,
      ytdlpFormatId: json['ytdlpFormatId'] as String?,
    );

Map<String, dynamic> _$$MediaFormatImplToJson(_$MediaFormatImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type': instance.type,
      'format': instance.format,
      'quality': instance.quality,
      'resolution': instance.resolution,
      'fps': instance.fps,
      'fileSize': instance.fileSize,
      'label': instance.label,
      'available': instance.available,
      'ytdlpFormatId': instance.ytdlpFormatId,
    };

_$MediaInfoImpl _$$MediaInfoImplFromJson(Map<String, dynamic> json) =>
    _$MediaInfoImpl(
      platform: json['platform'] as String,
      title: json['title'] as String?,
      thumbnail: json['thumbnail'] as String?,
      creator: json['creator'] as String?,
      duration: (json['duration'] as num?)?.toInt(),
      description: json['description'] as String?,
      isPublic: json['isPublic'] as bool? ?? true,
      watermarkNote: json['watermarkNote'] as String?,
    );

Map<String, dynamic> _$$MediaInfoImplToJson(_$MediaInfoImpl instance) =>
    <String, dynamic>{
      'platform': instance.platform,
      'title': instance.title,
      'thumbnail': instance.thumbnail,
      'creator': instance.creator,
      'duration': instance.duration,
      'description': instance.description,
      'isPublic': instance.isPublic,
      'watermarkNote': instance.watermarkNote,
    };

_$AnalyzeResultImpl _$$AnalyzeResultImplFromJson(Map<String, dynamic> json) =>
    _$AnalyzeResultImpl(
      success: json['success'] as bool,
      platform: json['platform'] as String,
      media: MediaInfo.fromJson(json['media'] as Map<String, dynamic>),
      formats: (json['formats'] as List<dynamic>?)
              ?.map((e) => MediaFormat.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      error: json['error'] as String?,
      errorCode: json['errorCode'] as String?,
    );

Map<String, dynamic> _$$AnalyzeResultImplToJson(_$AnalyzeResultImpl instance) =>
    <String, dynamic>{
      'success': instance.success,
      'platform': instance.platform,
      'media': instance.media,
      'formats': instance.formats,
      'error': instance.error,
      'errorCode': instance.errorCode,
    };

_$DownloadJobResponseImpl _$$DownloadJobResponseImplFromJson(
        Map<String, dynamic> json) =>
    _$DownloadJobResponseImpl(
      success: json['success'] as bool,
      jobId: json['jobId'] as String? ?? '',
      status: json['status'] as String?,
      downloadUrl: json['downloadUrl'] as String?,
      fileName: json['fileName'] as String?,
      progress: (json['progress'] as num?)?.toDouble(),
      message: json['message'] as String?,
      error: json['error'] as String?,
      errorCode: json['errorCode'] as String?,
    );

Map<String, dynamic> _$$DownloadJobResponseImplToJson(
        _$DownloadJobResponseImpl instance) =>
    <String, dynamic>{
      'success': instance.success,
      'jobId': instance.jobId,
      'status': instance.status,
      'downloadUrl': instance.downloadUrl,
      'fileName': instance.fileName,
      'progress': instance.progress,
      'message': instance.message,
      'error': instance.error,
      'errorCode': instance.errorCode,
    };

_$JobStatusResponseImpl _$$JobStatusResponseImplFromJson(
        Map<String, dynamic> json) =>
    _$JobStatusResponseImpl(
      id: json['id'] as String? ?? '',
      status: json['status'] as String? ?? 'pending',
      progress: (json['progress'] as num?)?.toDouble(),
      downloadUrl: json['downloadUrl'] as String?,
      fileName: json['fileName'] as String?,
      error: json['error'] as String?,
    );

Map<String, dynamic> _$$JobStatusResponseImplToJson(
        _$JobStatusResponseImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'status': instance.status,
      'progress': instance.progress,
      'downloadUrl': instance.downloadUrl,
      'fileName': instance.fileName,
      'error': instance.error,
    };
