// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'media_models.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

MediaFormat _$MediaFormatFromJson(Map<String, dynamic> json) {
  return _MediaFormat.fromJson(json);
}

/// @nodoc
mixin _$MediaFormat {
  String get id => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError; // "video" | "audio"
  String get format => throw _privateConstructorUsedError; // "mp4", "m4a", etc.
  String? get quality => throw _privateConstructorUsedError;
  String? get resolution => throw _privateConstructorUsedError;
  double? get fps => throw _privateConstructorUsedError;
  int? get fileSize => throw _privateConstructorUsedError;
  String? get label => throw _privateConstructorUsedError;
  bool get available => throw _privateConstructorUsedError;
  String? get ytdlpFormatId => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $MediaFormatCopyWith<MediaFormat> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MediaFormatCopyWith<$Res> {
  factory $MediaFormatCopyWith(
          MediaFormat value, $Res Function(MediaFormat) then) =
      _$MediaFormatCopyWithImpl<$Res, MediaFormat>;
  @useResult
  $Res call(
      {String id,
      String type,
      String format,
      String? quality,
      String? resolution,
      double? fps,
      int? fileSize,
      String? label,
      bool available,
      String? ytdlpFormatId});
}

/// @nodoc
class _$MediaFormatCopyWithImpl<$Res, $Val extends MediaFormat>
    implements $MediaFormatCopyWith<$Res> {
  _$MediaFormatCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? type = null,
    Object? format = null,
    Object? quality = freezed,
    Object? resolution = freezed,
    Object? fps = freezed,
    Object? fileSize = freezed,
    Object? label = freezed,
    Object? available = null,
    Object? ytdlpFormatId = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      format: null == format
          ? _value.format
          : format // ignore: cast_nullable_to_non_nullable
              as String,
      quality: freezed == quality
          ? _value.quality
          : quality // ignore: cast_nullable_to_non_nullable
              as String?,
      resolution: freezed == resolution
          ? _value.resolution
          : resolution // ignore: cast_nullable_to_non_nullable
              as String?,
      fps: freezed == fps
          ? _value.fps
          : fps // ignore: cast_nullable_to_non_nullable
              as double?,
      fileSize: freezed == fileSize
          ? _value.fileSize
          : fileSize // ignore: cast_nullable_to_non_nullable
              as int?,
      label: freezed == label
          ? _value.label
          : label // ignore: cast_nullable_to_non_nullable
              as String?,
      available: null == available
          ? _value.available
          : available // ignore: cast_nullable_to_non_nullable
              as bool,
      ytdlpFormatId: freezed == ytdlpFormatId
          ? _value.ytdlpFormatId
          : ytdlpFormatId // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MediaFormatImplCopyWith<$Res>
    implements $MediaFormatCopyWith<$Res> {
  factory _$$MediaFormatImplCopyWith(
          _$MediaFormatImpl value, $Res Function(_$MediaFormatImpl) then) =
      __$$MediaFormatImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String type,
      String format,
      String? quality,
      String? resolution,
      double? fps,
      int? fileSize,
      String? label,
      bool available,
      String? ytdlpFormatId});
}

/// @nodoc
class __$$MediaFormatImplCopyWithImpl<$Res>
    extends _$MediaFormatCopyWithImpl<$Res, _$MediaFormatImpl>
    implements _$$MediaFormatImplCopyWith<$Res> {
  __$$MediaFormatImplCopyWithImpl(
      _$MediaFormatImpl _value, $Res Function(_$MediaFormatImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? type = null,
    Object? format = null,
    Object? quality = freezed,
    Object? resolution = freezed,
    Object? fps = freezed,
    Object? fileSize = freezed,
    Object? label = freezed,
    Object? available = null,
    Object? ytdlpFormatId = freezed,
  }) {
    return _then(_$MediaFormatImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      format: null == format
          ? _value.format
          : format // ignore: cast_nullable_to_non_nullable
              as String,
      quality: freezed == quality
          ? _value.quality
          : quality // ignore: cast_nullable_to_non_nullable
              as String?,
      resolution: freezed == resolution
          ? _value.resolution
          : resolution // ignore: cast_nullable_to_non_nullable
              as String?,
      fps: freezed == fps
          ? _value.fps
          : fps // ignore: cast_nullable_to_non_nullable
              as double?,
      fileSize: freezed == fileSize
          ? _value.fileSize
          : fileSize // ignore: cast_nullable_to_non_nullable
              as int?,
      label: freezed == label
          ? _value.label
          : label // ignore: cast_nullable_to_non_nullable
              as String?,
      available: null == available
          ? _value.available
          : available // ignore: cast_nullable_to_non_nullable
              as bool,
      ytdlpFormatId: freezed == ytdlpFormatId
          ? _value.ytdlpFormatId
          : ytdlpFormatId // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MediaFormatImpl implements _MediaFormat {
  const _$MediaFormatImpl(
      {required this.id,
      required this.type,
      required this.format,
      this.quality,
      this.resolution,
      this.fps,
      this.fileSize,
      this.label,
      this.available = true,
      this.ytdlpFormatId});

  factory _$MediaFormatImpl.fromJson(Map<String, dynamic> json) =>
      _$$MediaFormatImplFromJson(json);

  @override
  final String id;
  @override
  final String type;
// "video" | "audio"
  @override
  final String format;
// "mp4", "m4a", etc.
  @override
  final String? quality;
  @override
  final String? resolution;
  @override
  final double? fps;
  @override
  final int? fileSize;
  @override
  final String? label;
  @override
  @JsonKey()
  final bool available;
  @override
  final String? ytdlpFormatId;

  @override
  String toString() {
    return 'MediaFormat(id: $id, type: $type, format: $format, quality: $quality, resolution: $resolution, fps: $fps, fileSize: $fileSize, label: $label, available: $available, ytdlpFormatId: $ytdlpFormatId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MediaFormatImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.format, format) || other.format == format) &&
            (identical(other.quality, quality) || other.quality == quality) &&
            (identical(other.resolution, resolution) ||
                other.resolution == resolution) &&
            (identical(other.fps, fps) || other.fps == fps) &&
            (identical(other.fileSize, fileSize) ||
                other.fileSize == fileSize) &&
            (identical(other.label, label) || other.label == label) &&
            (identical(other.available, available) ||
                other.available == available) &&
            (identical(other.ytdlpFormatId, ytdlpFormatId) ||
                other.ytdlpFormatId == ytdlpFormatId));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, id, type, format, quality,
      resolution, fps, fileSize, label, available, ytdlpFormatId);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$MediaFormatImplCopyWith<_$MediaFormatImpl> get copyWith =>
      __$$MediaFormatImplCopyWithImpl<_$MediaFormatImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MediaFormatImplToJson(
      this,
    );
  }
}

abstract class _MediaFormat implements MediaFormat {
  const factory _MediaFormat(
      {required final String id,
      required final String type,
      required final String format,
      final String? quality,
      final String? resolution,
      final double? fps,
      final int? fileSize,
      final String? label,
      final bool available,
      final String? ytdlpFormatId}) = _$MediaFormatImpl;

  factory _MediaFormat.fromJson(Map<String, dynamic> json) =
      _$MediaFormatImpl.fromJson;

  @override
  String get id;
  @override
  String get type;
  @override // "video" | "audio"
  String get format;
  @override // "mp4", "m4a", etc.
  String? get quality;
  @override
  String? get resolution;
  @override
  double? get fps;
  @override
  int? get fileSize;
  @override
  String? get label;
  @override
  bool get available;
  @override
  String? get ytdlpFormatId;
  @override
  @JsonKey(ignore: true)
  _$$MediaFormatImplCopyWith<_$MediaFormatImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

MediaInfo _$MediaInfoFromJson(Map<String, dynamic> json) {
  return _MediaInfo.fromJson(json);
}

/// @nodoc
mixin _$MediaInfo {
  String get platform => throw _privateConstructorUsedError;
  String? get title => throw _privateConstructorUsedError;
  String? get thumbnail => throw _privateConstructorUsedError;
  String? get creator => throw _privateConstructorUsedError;
  int? get duration => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  bool get isPublic => throw _privateConstructorUsedError;
  String? get watermarkNote => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $MediaInfoCopyWith<MediaInfo> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MediaInfoCopyWith<$Res> {
  factory $MediaInfoCopyWith(MediaInfo value, $Res Function(MediaInfo) then) =
      _$MediaInfoCopyWithImpl<$Res, MediaInfo>;
  @useResult
  $Res call(
      {String platform,
      String? title,
      String? thumbnail,
      String? creator,
      int? duration,
      String? description,
      bool isPublic,
      String? watermarkNote});
}

/// @nodoc
class _$MediaInfoCopyWithImpl<$Res, $Val extends MediaInfo>
    implements $MediaInfoCopyWith<$Res> {
  _$MediaInfoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? platform = null,
    Object? title = freezed,
    Object? thumbnail = freezed,
    Object? creator = freezed,
    Object? duration = freezed,
    Object? description = freezed,
    Object? isPublic = null,
    Object? watermarkNote = freezed,
  }) {
    return _then(_value.copyWith(
      platform: null == platform
          ? _value.platform
          : platform // ignore: cast_nullable_to_non_nullable
              as String,
      title: freezed == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String?,
      thumbnail: freezed == thumbnail
          ? _value.thumbnail
          : thumbnail // ignore: cast_nullable_to_non_nullable
              as String?,
      creator: freezed == creator
          ? _value.creator
          : creator // ignore: cast_nullable_to_non_nullable
              as String?,
      duration: freezed == duration
          ? _value.duration
          : duration // ignore: cast_nullable_to_non_nullable
              as int?,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      isPublic: null == isPublic
          ? _value.isPublic
          : isPublic // ignore: cast_nullable_to_non_nullable
              as bool,
      watermarkNote: freezed == watermarkNote
          ? _value.watermarkNote
          : watermarkNote // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MediaInfoImplCopyWith<$Res>
    implements $MediaInfoCopyWith<$Res> {
  factory _$$MediaInfoImplCopyWith(
          _$MediaInfoImpl value, $Res Function(_$MediaInfoImpl) then) =
      __$$MediaInfoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String platform,
      String? title,
      String? thumbnail,
      String? creator,
      int? duration,
      String? description,
      bool isPublic,
      String? watermarkNote});
}

/// @nodoc
class __$$MediaInfoImplCopyWithImpl<$Res>
    extends _$MediaInfoCopyWithImpl<$Res, _$MediaInfoImpl>
    implements _$$MediaInfoImplCopyWith<$Res> {
  __$$MediaInfoImplCopyWithImpl(
      _$MediaInfoImpl _value, $Res Function(_$MediaInfoImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? platform = null,
    Object? title = freezed,
    Object? thumbnail = freezed,
    Object? creator = freezed,
    Object? duration = freezed,
    Object? description = freezed,
    Object? isPublic = null,
    Object? watermarkNote = freezed,
  }) {
    return _then(_$MediaInfoImpl(
      platform: null == platform
          ? _value.platform
          : platform // ignore: cast_nullable_to_non_nullable
              as String,
      title: freezed == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String?,
      thumbnail: freezed == thumbnail
          ? _value.thumbnail
          : thumbnail // ignore: cast_nullable_to_non_nullable
              as String?,
      creator: freezed == creator
          ? _value.creator
          : creator // ignore: cast_nullable_to_non_nullable
              as String?,
      duration: freezed == duration
          ? _value.duration
          : duration // ignore: cast_nullable_to_non_nullable
              as int?,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      isPublic: null == isPublic
          ? _value.isPublic
          : isPublic // ignore: cast_nullable_to_non_nullable
              as bool,
      watermarkNote: freezed == watermarkNote
          ? _value.watermarkNote
          : watermarkNote // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MediaInfoImpl implements _MediaInfo {
  const _$MediaInfoImpl(
      {required this.platform,
      this.title,
      this.thumbnail,
      this.creator,
      this.duration,
      this.description,
      this.isPublic = true,
      this.watermarkNote});

  factory _$MediaInfoImpl.fromJson(Map<String, dynamic> json) =>
      _$$MediaInfoImplFromJson(json);

  @override
  final String platform;
  @override
  final String? title;
  @override
  final String? thumbnail;
  @override
  final String? creator;
  @override
  final int? duration;
  @override
  final String? description;
  @override
  @JsonKey()
  final bool isPublic;
  @override
  final String? watermarkNote;

  @override
  String toString() {
    return 'MediaInfo(platform: $platform, title: $title, thumbnail: $thumbnail, creator: $creator, duration: $duration, description: $description, isPublic: $isPublic, watermarkNote: $watermarkNote)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MediaInfoImpl &&
            (identical(other.platform, platform) ||
                other.platform == platform) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.thumbnail, thumbnail) ||
                other.thumbnail == thumbnail) &&
            (identical(other.creator, creator) || other.creator == creator) &&
            (identical(other.duration, duration) ||
                other.duration == duration) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.isPublic, isPublic) ||
                other.isPublic == isPublic) &&
            (identical(other.watermarkNote, watermarkNote) ||
                other.watermarkNote == watermarkNote));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, platform, title, thumbnail,
      creator, duration, description, isPublic, watermarkNote);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$MediaInfoImplCopyWith<_$MediaInfoImpl> get copyWith =>
      __$$MediaInfoImplCopyWithImpl<_$MediaInfoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MediaInfoImplToJson(
      this,
    );
  }
}

abstract class _MediaInfo implements MediaInfo {
  const factory _MediaInfo(
      {required final String platform,
      final String? title,
      final String? thumbnail,
      final String? creator,
      final int? duration,
      final String? description,
      final bool isPublic,
      final String? watermarkNote}) = _$MediaInfoImpl;

  factory _MediaInfo.fromJson(Map<String, dynamic> json) =
      _$MediaInfoImpl.fromJson;

  @override
  String get platform;
  @override
  String? get title;
  @override
  String? get thumbnail;
  @override
  String? get creator;
  @override
  int? get duration;
  @override
  String? get description;
  @override
  bool get isPublic;
  @override
  String? get watermarkNote;
  @override
  @JsonKey(ignore: true)
  _$$MediaInfoImplCopyWith<_$MediaInfoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

AnalyzeResult _$AnalyzeResultFromJson(Map<String, dynamic> json) {
  return _AnalyzeResult.fromJson(json);
}

/// @nodoc
mixin _$AnalyzeResult {
  bool get success => throw _privateConstructorUsedError;
  String get platform => throw _privateConstructorUsedError;
  MediaInfo get media => throw _privateConstructorUsedError;
  List<MediaFormat> get formats => throw _privateConstructorUsedError;
  String? get error => throw _privateConstructorUsedError;
  String? get errorCode => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $AnalyzeResultCopyWith<AnalyzeResult> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AnalyzeResultCopyWith<$Res> {
  factory $AnalyzeResultCopyWith(
          AnalyzeResult value, $Res Function(AnalyzeResult) then) =
      _$AnalyzeResultCopyWithImpl<$Res, AnalyzeResult>;
  @useResult
  $Res call(
      {bool success,
      String platform,
      MediaInfo media,
      List<MediaFormat> formats,
      String? error,
      String? errorCode});

  $MediaInfoCopyWith<$Res> get media;
}

/// @nodoc
class _$AnalyzeResultCopyWithImpl<$Res, $Val extends AnalyzeResult>
    implements $AnalyzeResultCopyWith<$Res> {
  _$AnalyzeResultCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? success = null,
    Object? platform = null,
    Object? media = null,
    Object? formats = null,
    Object? error = freezed,
    Object? errorCode = freezed,
  }) {
    return _then(_value.copyWith(
      success: null == success
          ? _value.success
          : success // ignore: cast_nullable_to_non_nullable
              as bool,
      platform: null == platform
          ? _value.platform
          : platform // ignore: cast_nullable_to_non_nullable
              as String,
      media: null == media
          ? _value.media
          : media // ignore: cast_nullable_to_non_nullable
              as MediaInfo,
      formats: null == formats
          ? _value.formats
          : formats // ignore: cast_nullable_to_non_nullable
              as List<MediaFormat>,
      error: freezed == error
          ? _value.error
          : error // ignore: cast_nullable_to_non_nullable
              as String?,
      errorCode: freezed == errorCode
          ? _value.errorCode
          : errorCode // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $MediaInfoCopyWith<$Res> get media {
    return $MediaInfoCopyWith<$Res>(_value.media, (value) {
      return _then(_value.copyWith(media: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$AnalyzeResultImplCopyWith<$Res>
    implements $AnalyzeResultCopyWith<$Res> {
  factory _$$AnalyzeResultImplCopyWith(
          _$AnalyzeResultImpl value, $Res Function(_$AnalyzeResultImpl) then) =
      __$$AnalyzeResultImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {bool success,
      String platform,
      MediaInfo media,
      List<MediaFormat> formats,
      String? error,
      String? errorCode});

  @override
  $MediaInfoCopyWith<$Res> get media;
}

/// @nodoc
class __$$AnalyzeResultImplCopyWithImpl<$Res>
    extends _$AnalyzeResultCopyWithImpl<$Res, _$AnalyzeResultImpl>
    implements _$$AnalyzeResultImplCopyWith<$Res> {
  __$$AnalyzeResultImplCopyWithImpl(
      _$AnalyzeResultImpl _value, $Res Function(_$AnalyzeResultImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? success = null,
    Object? platform = null,
    Object? media = null,
    Object? formats = null,
    Object? error = freezed,
    Object? errorCode = freezed,
  }) {
    return _then(_$AnalyzeResultImpl(
      success: null == success
          ? _value.success
          : success // ignore: cast_nullable_to_non_nullable
              as bool,
      platform: null == platform
          ? _value.platform
          : platform // ignore: cast_nullable_to_non_nullable
              as String,
      media: null == media
          ? _value.media
          : media // ignore: cast_nullable_to_non_nullable
              as MediaInfo,
      formats: null == formats
          ? _value._formats
          : formats // ignore: cast_nullable_to_non_nullable
              as List<MediaFormat>,
      error: freezed == error
          ? _value.error
          : error // ignore: cast_nullable_to_non_nullable
              as String?,
      errorCode: freezed == errorCode
          ? _value.errorCode
          : errorCode // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$AnalyzeResultImpl implements _AnalyzeResult {
  const _$AnalyzeResultImpl(
      {required this.success,
      required this.platform,
      required this.media,
      final List<MediaFormat> formats = const [],
      this.error,
      this.errorCode})
      : _formats = formats;

  factory _$AnalyzeResultImpl.fromJson(Map<String, dynamic> json) =>
      _$$AnalyzeResultImplFromJson(json);

  @override
  final bool success;
  @override
  final String platform;
  @override
  final MediaInfo media;
  final List<MediaFormat> _formats;
  @override
  @JsonKey()
  List<MediaFormat> get formats {
    if (_formats is EqualUnmodifiableListView) return _formats;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_formats);
  }

  @override
  final String? error;
  @override
  final String? errorCode;

  @override
  String toString() {
    return 'AnalyzeResult(success: $success, platform: $platform, media: $media, formats: $formats, error: $error, errorCode: $errorCode)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AnalyzeResultImpl &&
            (identical(other.success, success) || other.success == success) &&
            (identical(other.platform, platform) ||
                other.platform == platform) &&
            (identical(other.media, media) || other.media == media) &&
            const DeepCollectionEquality().equals(other._formats, _formats) &&
            (identical(other.error, error) || other.error == error) &&
            (identical(other.errorCode, errorCode) ||
                other.errorCode == errorCode));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, success, platform, media,
      const DeepCollectionEquality().hash(_formats), error, errorCode);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$AnalyzeResultImplCopyWith<_$AnalyzeResultImpl> get copyWith =>
      __$$AnalyzeResultImplCopyWithImpl<_$AnalyzeResultImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AnalyzeResultImplToJson(
      this,
    );
  }
}

abstract class _AnalyzeResult implements AnalyzeResult {
  const factory _AnalyzeResult(
      {required final bool success,
      required final String platform,
      required final MediaInfo media,
      final List<MediaFormat> formats,
      final String? error,
      final String? errorCode}) = _$AnalyzeResultImpl;

  factory _AnalyzeResult.fromJson(Map<String, dynamic> json) =
      _$AnalyzeResultImpl.fromJson;

  @override
  bool get success;
  @override
  String get platform;
  @override
  MediaInfo get media;
  @override
  List<MediaFormat> get formats;
  @override
  String? get error;
  @override
  String? get errorCode;
  @override
  @JsonKey(ignore: true)
  _$$AnalyzeResultImplCopyWith<_$AnalyzeResultImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

DownloadJobResponse _$DownloadJobResponseFromJson(Map<String, dynamic> json) {
  return _DownloadJobResponse.fromJson(json);
}

/// @nodoc
mixin _$DownloadJobResponse {
  bool get success => throw _privateConstructorUsedError;
  String get jobId => throw _privateConstructorUsedError;
  String? get status => throw _privateConstructorUsedError;
  String? get downloadUrl => throw _privateConstructorUsedError;
  String? get fileName => throw _privateConstructorUsedError;
  double? get progress => throw _privateConstructorUsedError;
  String? get message => throw _privateConstructorUsedError;
  String? get error => throw _privateConstructorUsedError;
  String? get errorCode => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $DownloadJobResponseCopyWith<DownloadJobResponse> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DownloadJobResponseCopyWith<$Res> {
  factory $DownloadJobResponseCopyWith(
          DownloadJobResponse value, $Res Function(DownloadJobResponse) then) =
      _$DownloadJobResponseCopyWithImpl<$Res, DownloadJobResponse>;
  @useResult
  $Res call(
      {bool success,
      String jobId,
      String? status,
      String? downloadUrl,
      String? fileName,
      double? progress,
      String? message,
      String? error,
      String? errorCode});
}

/// @nodoc
class _$DownloadJobResponseCopyWithImpl<$Res, $Val extends DownloadJobResponse>
    implements $DownloadJobResponseCopyWith<$Res> {
  _$DownloadJobResponseCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? success = null,
    Object? jobId = null,
    Object? status = freezed,
    Object? downloadUrl = freezed,
    Object? fileName = freezed,
    Object? progress = freezed,
    Object? message = freezed,
    Object? error = freezed,
    Object? errorCode = freezed,
  }) {
    return _then(_value.copyWith(
      success: null == success
          ? _value.success
          : success // ignore: cast_nullable_to_non_nullable
              as bool,
      jobId: null == jobId
          ? _value.jobId
          : jobId // ignore: cast_nullable_to_non_nullable
              as String,
      status: freezed == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String?,
      downloadUrl: freezed == downloadUrl
          ? _value.downloadUrl
          : downloadUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      fileName: freezed == fileName
          ? _value.fileName
          : fileName // ignore: cast_nullable_to_non_nullable
              as String?,
      progress: freezed == progress
          ? _value.progress
          : progress // ignore: cast_nullable_to_non_nullable
              as double?,
      message: freezed == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String?,
      error: freezed == error
          ? _value.error
          : error // ignore: cast_nullable_to_non_nullable
              as String?,
      errorCode: freezed == errorCode
          ? _value.errorCode
          : errorCode // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$DownloadJobResponseImplCopyWith<$Res>
    implements $DownloadJobResponseCopyWith<$Res> {
  factory _$$DownloadJobResponseImplCopyWith(_$DownloadJobResponseImpl value,
          $Res Function(_$DownloadJobResponseImpl) then) =
      __$$DownloadJobResponseImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {bool success,
      String jobId,
      String? status,
      String? downloadUrl,
      String? fileName,
      double? progress,
      String? message,
      String? error,
      String? errorCode});
}

/// @nodoc
class __$$DownloadJobResponseImplCopyWithImpl<$Res>
    extends _$DownloadJobResponseCopyWithImpl<$Res, _$DownloadJobResponseImpl>
    implements _$$DownloadJobResponseImplCopyWith<$Res> {
  __$$DownloadJobResponseImplCopyWithImpl(_$DownloadJobResponseImpl _value,
      $Res Function(_$DownloadJobResponseImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? success = null,
    Object? jobId = null,
    Object? status = freezed,
    Object? downloadUrl = freezed,
    Object? fileName = freezed,
    Object? progress = freezed,
    Object? message = freezed,
    Object? error = freezed,
    Object? errorCode = freezed,
  }) {
    return _then(_$DownloadJobResponseImpl(
      success: null == success
          ? _value.success
          : success // ignore: cast_nullable_to_non_nullable
              as bool,
      jobId: null == jobId
          ? _value.jobId
          : jobId // ignore: cast_nullable_to_non_nullable
              as String,
      status: freezed == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String?,
      downloadUrl: freezed == downloadUrl
          ? _value.downloadUrl
          : downloadUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      fileName: freezed == fileName
          ? _value.fileName
          : fileName // ignore: cast_nullable_to_non_nullable
              as String?,
      progress: freezed == progress
          ? _value.progress
          : progress // ignore: cast_nullable_to_non_nullable
              as double?,
      message: freezed == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String?,
      error: freezed == error
          ? _value.error
          : error // ignore: cast_nullable_to_non_nullable
              as String?,
      errorCode: freezed == errorCode
          ? _value.errorCode
          : errorCode // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$DownloadJobResponseImpl implements _DownloadJobResponse {
  const _$DownloadJobResponseImpl(
      {required this.success,
      this.jobId = '',
      this.status,
      this.downloadUrl,
      this.fileName,
      this.progress,
      this.message,
      this.error,
      this.errorCode});

  factory _$DownloadJobResponseImpl.fromJson(Map<String, dynamic> json) =>
      _$$DownloadJobResponseImplFromJson(json);

  @override
  final bool success;
  @override
  @JsonKey()
  final String jobId;
  @override
  final String? status;
  @override
  final String? downloadUrl;
  @override
  final String? fileName;
  @override
  final double? progress;
  @override
  final String? message;
  @override
  final String? error;
  @override
  final String? errorCode;

  @override
  String toString() {
    return 'DownloadJobResponse(success: $success, jobId: $jobId, status: $status, downloadUrl: $downloadUrl, fileName: $fileName, progress: $progress, message: $message, error: $error, errorCode: $errorCode)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DownloadJobResponseImpl &&
            (identical(other.success, success) || other.success == success) &&
            (identical(other.jobId, jobId) || other.jobId == jobId) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.downloadUrl, downloadUrl) ||
                other.downloadUrl == downloadUrl) &&
            (identical(other.fileName, fileName) ||
                other.fileName == fileName) &&
            (identical(other.progress, progress) ||
                other.progress == progress) &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.error, error) || other.error == error) &&
            (identical(other.errorCode, errorCode) ||
                other.errorCode == errorCode));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, success, jobId, status,
      downloadUrl, fileName, progress, message, error, errorCode);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$DownloadJobResponseImplCopyWith<_$DownloadJobResponseImpl> get copyWith =>
      __$$DownloadJobResponseImplCopyWithImpl<_$DownloadJobResponseImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DownloadJobResponseImplToJson(
      this,
    );
  }
}

abstract class _DownloadJobResponse implements DownloadJobResponse {
  const factory _DownloadJobResponse(
      {required final bool success,
      final String jobId,
      final String? status,
      final String? downloadUrl,
      final String? fileName,
      final double? progress,
      final String? message,
      final String? error,
      final String? errorCode}) = _$DownloadJobResponseImpl;

  factory _DownloadJobResponse.fromJson(Map<String, dynamic> json) =
      _$DownloadJobResponseImpl.fromJson;

  @override
  bool get success;
  @override
  String get jobId;
  @override
  String? get status;
  @override
  String? get downloadUrl;
  @override
  String? get fileName;
  @override
  double? get progress;
  @override
  String? get message;
  @override
  String? get error;
  @override
  String? get errorCode;
  @override
  @JsonKey(ignore: true)
  _$$DownloadJobResponseImplCopyWith<_$DownloadJobResponseImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

JobStatusResponse _$JobStatusResponseFromJson(Map<String, dynamic> json) {
  return _JobStatusResponse.fromJson(json);
}

/// @nodoc
mixin _$JobStatusResponse {
  String get id => throw _privateConstructorUsedError;
  String get status =>
      throw _privateConstructorUsedError; // pending, processing, completed, failed, expired
  double? get progress => throw _privateConstructorUsedError;
  String? get downloadUrl => throw _privateConstructorUsedError;
  String? get fileName => throw _privateConstructorUsedError;
  String? get error => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $JobStatusResponseCopyWith<JobStatusResponse> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $JobStatusResponseCopyWith<$Res> {
  factory $JobStatusResponseCopyWith(
          JobStatusResponse value, $Res Function(JobStatusResponse) then) =
      _$JobStatusResponseCopyWithImpl<$Res, JobStatusResponse>;
  @useResult
  $Res call(
      {String id,
      String status,
      double? progress,
      String? downloadUrl,
      String? fileName,
      String? error});
}

/// @nodoc
class _$JobStatusResponseCopyWithImpl<$Res, $Val extends JobStatusResponse>
    implements $JobStatusResponseCopyWith<$Res> {
  _$JobStatusResponseCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? status = null,
    Object? progress = freezed,
    Object? downloadUrl = freezed,
    Object? fileName = freezed,
    Object? error = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      progress: freezed == progress
          ? _value.progress
          : progress // ignore: cast_nullable_to_non_nullable
              as double?,
      downloadUrl: freezed == downloadUrl
          ? _value.downloadUrl
          : downloadUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      fileName: freezed == fileName
          ? _value.fileName
          : fileName // ignore: cast_nullable_to_non_nullable
              as String?,
      error: freezed == error
          ? _value.error
          : error // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$JobStatusResponseImplCopyWith<$Res>
    implements $JobStatusResponseCopyWith<$Res> {
  factory _$$JobStatusResponseImplCopyWith(_$JobStatusResponseImpl value,
          $Res Function(_$JobStatusResponseImpl) then) =
      __$$JobStatusResponseImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String status,
      double? progress,
      String? downloadUrl,
      String? fileName,
      String? error});
}

/// @nodoc
class __$$JobStatusResponseImplCopyWithImpl<$Res>
    extends _$JobStatusResponseCopyWithImpl<$Res, _$JobStatusResponseImpl>
    implements _$$JobStatusResponseImplCopyWith<$Res> {
  __$$JobStatusResponseImplCopyWithImpl(_$JobStatusResponseImpl _value,
      $Res Function(_$JobStatusResponseImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? status = null,
    Object? progress = freezed,
    Object? downloadUrl = freezed,
    Object? fileName = freezed,
    Object? error = freezed,
  }) {
    return _then(_$JobStatusResponseImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      progress: freezed == progress
          ? _value.progress
          : progress // ignore: cast_nullable_to_non_nullable
              as double?,
      downloadUrl: freezed == downloadUrl
          ? _value.downloadUrl
          : downloadUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      fileName: freezed == fileName
          ? _value.fileName
          : fileName // ignore: cast_nullable_to_non_nullable
              as String?,
      error: freezed == error
          ? _value.error
          : error // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$JobStatusResponseImpl implements _JobStatusResponse {
  const _$JobStatusResponseImpl(
      {this.id = '',
      this.status = 'pending',
      this.progress,
      this.downloadUrl,
      this.fileName,
      this.error});

  factory _$JobStatusResponseImpl.fromJson(Map<String, dynamic> json) =>
      _$$JobStatusResponseImplFromJson(json);

  @override
  @JsonKey()
  final String id;
  @override
  @JsonKey()
  final String status;
// pending, processing, completed, failed, expired
  @override
  final double? progress;
  @override
  final String? downloadUrl;
  @override
  final String? fileName;
  @override
  final String? error;

  @override
  String toString() {
    return 'JobStatusResponse(id: $id, status: $status, progress: $progress, downloadUrl: $downloadUrl, fileName: $fileName, error: $error)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$JobStatusResponseImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.progress, progress) ||
                other.progress == progress) &&
            (identical(other.downloadUrl, downloadUrl) ||
                other.downloadUrl == downloadUrl) &&
            (identical(other.fileName, fileName) ||
                other.fileName == fileName) &&
            (identical(other.error, error) || other.error == error));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType, id, status, progress, downloadUrl, fileName, error);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$JobStatusResponseImplCopyWith<_$JobStatusResponseImpl> get copyWith =>
      __$$JobStatusResponseImplCopyWithImpl<_$JobStatusResponseImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$JobStatusResponseImplToJson(
      this,
    );
  }
}

abstract class _JobStatusResponse implements JobStatusResponse {
  const factory _JobStatusResponse(
      {final String id,
      final String status,
      final double? progress,
      final String? downloadUrl,
      final String? fileName,
      final String? error}) = _$JobStatusResponseImpl;

  factory _JobStatusResponse.fromJson(Map<String, dynamic> json) =
      _$JobStatusResponseImpl.fromJson;

  @override
  String get id;
  @override
  String get status;
  @override // pending, processing, completed, failed, expired
  double? get progress;
  @override
  String? get downloadUrl;
  @override
  String? get fileName;
  @override
  String? get error;
  @override
  @JsonKey(ignore: true)
  _$$JobStatusResponseImplCopyWith<_$JobStatusResponseImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
