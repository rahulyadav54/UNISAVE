import 'dart:async';
import 'package:dio/dio.dart';
import '../data/models/media_models.dart';

class UnisaveApiClient {
  final Dio _dio;
  final String baseUrl;

  UnisaveApiClient({required this.baseUrl})
      : _dio = Dio(BaseOptions(
          baseUrl: baseUrl,
          connectTimeout: const Duration(seconds: 15),
          receiveTimeout: const Duration(seconds: 120),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        )) {
    _dio.interceptors.add(InterceptorsWrapper(
      onError: (DioException e, handler) async {
        if (e.type == DioExceptionType.connectionTimeout ||
            e.type == DioExceptionType.receiveTimeout) {
          if (e.requestOptions.extra['retries'] == null) {
            e.requestOptions.extra['retries'] = 1;
            try {
              final response = await _dio.request(
                e.requestOptions.path,
                options: Options(
                  method: e.requestOptions.method,
                  headers: e.requestOptions.headers,
                ),
                data: e.requestOptions.data,
                queryParameters: e.requestOptions.queryParameters,
              );
              return handler.resolve(response);
            } catch (_) {}
          }
        }
        return handler.next(e);
      },
    ));
  }

  /// Analyzes a given media URL by hitting the backend endpoint.
  Future<AnalyzeResult> analyzeUrl(String url) async {
    try {
      final response = await _dio.post(
        '/api/media/analyze',
        data: {'url': url},
      );
      return AnalyzeResult.fromJson(response.data);
    } on DioException catch (e) {
      if (e.response != null && e.response?.data != null) {
        return AnalyzeResult.fromJson(e.response!.data);
      }
      return AnalyzeResult(
        success: false,
        platform: 'unknown',
        media: const MediaInfo(platform: 'unknown'),
        error: _handleDioError(e),
        errorCode: 'NETWORK_ERROR',
      );
    } catch (e) {
      return AnalyzeResult(
        success: false,
        platform: 'unknown',
        media: const MediaInfo(platform: 'unknown'),
        error: 'An unexpected error occurred.',
        errorCode: 'UNKNOWN_ERROR',
      );
    }
  }

  /// Initiates a download job for the analyzed media.
  Future<DownloadJobResponse> startDownload(
    String url,
    String formatId, {
    CancelToken? cancelToken,
  }) async {
    try {
      final response = await _dio.post(
        '/api/media/download',
        data: {'url': url, 'formatId': formatId},
        cancelToken: cancelToken,
        options: Options(
          receiveTimeout: const Duration(seconds: 60),
        ),
      );
      return DownloadJobResponse.fromJson(response.data);
    } on DioException catch (e) {
      if (e.type == DioExceptionType.cancel) {
        return const DownloadJobResponse(
          success: false,
          jobId: '',
          error: 'Download cancelled.',
          errorCode: 'CANCELLED',
        );
      }
      if (e.response != null && e.response?.data != null) {
        return DownloadJobResponse.fromJson(e.response!.data);
      }
      return DownloadJobResponse(
        success: false,
        jobId: '',
        error: _handleDioError(e),
        errorCode: 'NETWORK_ERROR',
      );
    } catch (e) {
      return const DownloadJobResponse(
        success: false,
        jobId: '',
        error: 'An unexpected error occurred.',
        errorCode: 'UNKNOWN_ERROR',
      );
    }
  }

  /// Polls the status of an ongoing backend download job.
  Future<JobStatusResponse> getJobStatus(
    String jobId, {
    CancelToken? cancelToken,
  }) async {
    try {
      final response = await _dio.get(
        '/api/media/status/$jobId',
        cancelToken: cancelToken,
        options: Options(
          receiveTimeout: const Duration(seconds: 15),
        ),
      );
      return JobStatusResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception(_handleDioError(e));
    }
  }

  /// Streams a file directly to disk with live byte progress and cancellation.
  Future<void> streamDownloadFile({
    required String downloadUrl,
    required String savePath,
    required ProgressCallback onReceiveProgress,
    CancelToken? cancelToken,
  }) async {
    String fullUrl = downloadUrl;
    if (fullUrl.startsWith('/')) {
      fullUrl = '$baseUrl$fullUrl';
    }

    await _dio.download(
      fullUrl,
      savePath,
      onReceiveProgress: onReceiveProgress,
      cancelToken: cancelToken,
      options: Options(
        responseType: ResponseType.stream,
        followRedirects: true,
        receiveTimeout: const Duration(minutes: 15),
      ),
    );
  }

  String _handleDioError(DioException e) {
    switch (e.type) {
      case DioExceptionType.cancel:
        return 'Request was cancelled.';
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return 'Connection timed out. Please check your internet connection.';
      case DioExceptionType.badResponse:
        final code = e.response?.statusCode;
        if (code == 404) return 'Media file not found or expired.';
        if (code == 429) return 'Too many requests. Please wait a moment.';
        if (code != null && code >= 500) return 'Server error. Please try again.';
        return 'Server returned an error ($code).';
      case DioExceptionType.connectionError:
        return 'No internet connection.';
      default:
        return 'Network error occurred.';
    }
  }
}
