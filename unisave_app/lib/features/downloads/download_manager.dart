import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../services/api_service.dart';
import '../analyzer/analyzer_provider.dart';
import '../history/history_provider.dart';

enum DownloadStatus {
  queued,
  resolving,
  starting,
  downloading,
  paused,
  completed,
  failed,
  cancelled,
}

class DownloadTask {
  final String id;
  final String url;
  final String formatId;
  final String title;
  final String? thumbnail;
  final String platform;
  final String quality;
  final DownloadStatus status;
  final int downloadedBytes;
  final int totalBytes;
  final double speedBytesPerSec;
  final int? etaSeconds;
  final double progress; // 0.0 to 1.0
  final String? filePath;
  final String? tempFilePath;
  final String? errorMessage;
  final int elapsedSeconds;
  final int retryCount;
  final DateTime createdAt;
  final DateTime? completedAt;

  DownloadTask({
    required this.id,
    required this.url,
    required this.formatId,
    required this.title,
    this.thumbnail,
    required this.platform,
    this.quality = 'Best',
    this.status = DownloadStatus.queued,
    this.downloadedBytes = 0,
    this.totalBytes = 0,
    this.speedBytesPerSec = 0.0,
    this.etaSeconds,
    this.progress = 0.0,
    this.filePath,
    this.tempFilePath,
    this.errorMessage,
    this.elapsedSeconds = 0,
    this.retryCount = 0,
    DateTime? createdAt,
    this.completedAt,
  }) : createdAt = createdAt ?? DateTime.now();

  DownloadTask copyWith({
    DownloadStatus? status,
    int? downloadedBytes,
    int? totalBytes,
    double? speedBytesPerSec,
    int? etaSeconds,
    double? progress,
    String? filePath,
    String? tempFilePath,
    String? errorMessage,
    int? elapsedSeconds,
    int? retryCount,
    DateTime? completedAt,
  }) {
    return DownloadTask(
      id: id,
      url: url,
      formatId: formatId,
      title: title,
      thumbnail: thumbnail,
      platform: platform,
      quality: quality,
      status: status ?? this.status,
      downloadedBytes: downloadedBytes ?? this.downloadedBytes,
      totalBytes: totalBytes ?? this.totalBytes,
      speedBytesPerSec: speedBytesPerSec ?? this.speedBytesPerSec,
      etaSeconds: etaSeconds ?? this.etaSeconds,
      progress: progress ?? this.progress,
      filePath: filePath ?? this.filePath,
      tempFilePath: tempFilePath ?? this.tempFilePath,
      errorMessage: errorMessage ?? this.errorMessage,
      elapsedSeconds: elapsedSeconds ?? this.elapsedSeconds,
      retryCount: retryCount ?? this.retryCount,
      createdAt: createdAt,
      completedAt: completedAt ?? this.completedAt,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'url': url,
        'formatId': formatId,
        'title': title,
        'thumbnail': thumbnail,
        'platform': platform,
        'quality': quality,
        'status': status.name,
        'downloadedBytes': downloadedBytes,
        'totalBytes': totalBytes,
        'progress': progress,
        'filePath': filePath,
        'tempFilePath': tempFilePath,
        'errorMessage': errorMessage,
        'elapsedSeconds': elapsedSeconds,
        'retryCount': retryCount,
        'createdAt': createdAt.toIso8601String(),
        'completedAt': completedAt?.toIso8601String(),
      };

  factory DownloadTask.fromJson(Map<String, dynamic> json) => DownloadTask(
        id: json['id'] as String,
        url: json['url'] as String,
        formatId: json['formatId'] as String,
        title: json['title'] as String,
        thumbnail: json['thumbnail'] as String?,
        platform: json['platform'] as String,
        quality: json['quality'] as String? ?? 'Best',
        status: DownloadStatus.values.firstWhere(
          (e) => e.name == json['status'],
          orElse: () => DownloadStatus.failed,
        ),
        downloadedBytes: json['downloadedBytes'] as int? ?? 0,
        totalBytes: json['totalBytes'] as int? ?? 0,
        progress: (json['progress'] as num?)?.toDouble() ?? 0.0,
        filePath: json['filePath'] as String?,
        tempFilePath: json['tempFilePath'] as String?,
        errorMessage: json['errorMessage'] as String?,
        elapsedSeconds: json['elapsedSeconds'] as int? ?? 0,
        retryCount: json['retryCount'] as int? ?? 0,
        createdAt: json['createdAt'] != null
            ? DateTime.parse(json['createdAt'] as String)
            : DateTime.now(),
        completedAt: json['completedAt'] != null
            ? DateTime.parse(json['completedAt'] as String)
            : null,
      );
}

class DownloadManagerNotifier extends StateNotifier<List<DownloadTask>> {
  final UnisaveApiClient _apiClient;
  final Ref _ref;
  static const _storageKey = 'unisave_active_downloads_v2';
  static const int maxConcurrentDownloads = 2;

  final Map<String, CancelToken> _cancelTokens = {};
  final Map<String, Timer> _pollingTimers = {};
  final Map<String, Timer> _elapsedTimers = {};

  final Map<String, List<int>> _speedHistory = {};
  final Map<String, int> _lastSpeedTimestamp = {};
  final Map<String, int> _lastDownloadedBytes = {};

  DownloadManagerNotifier(this._apiClient, this._ref) : super([]) {
    _restoreTasks();
  }

  Future<void> _restoreTasks() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getStringList(_storageKey) ?? [];
      if (raw.isNotEmpty) {
        final restored = raw.map((str) {
          final t = DownloadTask.fromJson(jsonDecode(str));
          if (t.status == DownloadStatus.downloading ||
              t.status == DownloadStatus.resolving ||
              t.status == DownloadStatus.starting) {
            return t.copyWith(
              status: DownloadStatus.paused,
              errorMessage: 'Download paused on app restart.',
            );
          }
          return t;
        }).toList();
        state = restored;
      }
    } catch (e) {
      debugPrint('[DownloadManager] Failed to restore tasks: $e');
    }
  }

  Future<void> _persistTasks() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = state.map((t) => jsonEncode(t.toJson())).toList();
      await prefs.setStringList(_storageKey, raw);
    } catch (e) {
      debugPrint('[DownloadManager] Failed to persist tasks: $e');
    }
  }

  void _updateTask(String id, DownloadTask Function(DownloadTask) updater) {
    state = state.map((t) {
      if (t.id == id) {
        return updater(t);
      }
      return t;
    }).toList();
    _persistTasks();
  }

  Future<void> enqueueDownload({
    required String url,
    required String formatId,
    required String title,
    required String platform,
    String quality = 'Best',
    String? thumbnail,
  }) async {
    final exists = state.any((t) =>
        t.url == url &&
        t.formatId == formatId &&
        (t.status == DownloadStatus.queued ||
            t.status == DownloadStatus.resolving ||
            t.status == DownloadStatus.starting ||
            t.status == DownloadStatus.downloading));
    if (exists) return;

    final taskId =
        'task_${DateTime.now().millisecondsSinceEpoch}_${Random().nextInt(9999)}';
    final newTask = DownloadTask(
      id: taskId,
      url: url,
      formatId: formatId,
      title: title,
      thumbnail: thumbnail,
      platform: platform,
      quality: quality,
      status: DownloadStatus.queued,
    );

    state = [newTask, ...state];
    await _persistTasks();

    _processQueue();
  }

  void _processQueue() {
    final activeCount = state
        .where((t) =>
            t.status == DownloadStatus.resolving ||
            t.status == DownloadStatus.starting ||
            t.status == DownloadStatus.downloading)
        .length;

    if (activeCount >= maxConcurrentDownloads) return;

    final nextIndex =
        state.indexWhere((t) => t.status == DownloadStatus.queued);
    if (nextIndex == -1) return;

    final taskToStart = state[nextIndex];
    _startTaskExecution(taskToStart.id);
  }

  void _startTaskExecution(String taskId) async {
    final cancelToken = CancelToken();
    _cancelTokens[taskId] = cancelToken;

    _updateTask(taskId, (t) => t.copyWith(
          status: DownloadStatus.resolving,
          errorMessage: null,
          progress: 0.0,
        ));

    _startElapsedTimer(taskId);

    final task = state.firstWhere((t) => t.id == taskId);

    try {
      final startResponse = await _apiClient.startDownload(
        task.url,
        task.formatId,
        cancelToken: cancelToken,
      );

      if (cancelToken.isCancelled) return;

      if (!startResponse.success && (startResponse.jobId.isEmpty)) {
        _handleTaskFailure(
          taskId,
          startResponse.error ?? 'Server could not prepare this format.',
          allowRetry: true,
        );
        return;
      }

      if (startResponse.downloadUrl != null &&
          startResponse.status == 'completed') {
        await _executeFileDownload(
            taskId, startResponse.downloadUrl!, startResponse.fileName);
        return;
      }

      _pollBackendStatus(startResponse.jobId, taskId, cancelToken);
    } catch (e) {
      if (cancelToken.isCancelled) return;
      _handleTaskFailure(taskId, e.toString(), allowRetry: true);
    }
  }

  void _pollBackendStatus(
      String jobId, String taskId, CancelToken cancelToken) {
    _pollingTimers[taskId]?.cancel();
    int attempts = 0;
    const maxAttempts = 90;

    _pollingTimers[taskId] =
        Timer.periodic(const Duration(seconds: 3), (timer) async {
      if (cancelToken.isCancelled) {
        timer.cancel();
        return;
      }

      attempts++;
      if (attempts > maxAttempts) {
        timer.cancel();
        _handleTaskFailure(
          taskId,
          'Media preparation timed out on server. Tap Retry.',
          allowRetry: true,
        );
        return;
      }

      try {
        final statusRes =
            await _apiClient.getJobStatus(jobId, cancelToken: cancelToken);

        if (cancelToken.isCancelled) {
          timer.cancel();
          return;
        }

        if (statusRes.status == 'completed' && statusRes.downloadUrl != null) {
          timer.cancel();
          await _executeFileDownload(
              taskId, statusRes.downloadUrl!, statusRes.fileName);
        } else if (statusRes.status == 'failed' ||
            statusRes.status == 'expired') {
          timer.cancel();
          _handleTaskFailure(
            taskId,
            statusRes.error ?? 'Server processing failed for this media.',
            allowRetry: true,
          );
        }
      } catch (e) {
        if (cancelToken.isCancelled) timer.cancel();
      }
    });
  }

  Future<void> _executeFileDownload(
    String taskId,
    String downloadUrl,
    String? serverFileName,
  ) async {
    final cancelToken = _cancelTokens[taskId] ?? CancelToken();
    _cancelTokens[taskId] = cancelToken;

    _updateTask(taskId, (t) => t.copyWith(status: DownloadStatus.starting));

    try {
      final task = state.firstWhere((t) => t.id == taskId);

      final ext = task.formatId.contains('audio') ? 'm4a' : 'mp4';
      final safeTitle = task.title
          .replaceAll(RegExp(r'[\\/:*?"<>|]'), '_')
          .replaceAll('..', '_')
          .trim();
      final baseFileName = serverFileName != null && serverFileName.isNotEmpty
          ? serverFileName
          : '$safeTitle.$ext';

      final dir = await getApplicationDocumentsDirectory();
      final downloadsDir = Directory('${dir.path}/UNISAVE');
      if (!await downloadsDir.exists()) {
        await downloadsDir.create(recursive: true);
      }

      final tempPartPath = '${downloadsDir.path}/.$taskId.part';
      final finalFilePath = '${downloadsDir.path}/$baseFileName';

      _updateTask(taskId, (t) => t.copyWith(
            status: DownloadStatus.downloading,
            tempFilePath: tempPartPath,
            filePath: finalFilePath,
          ));

      _speedHistory[taskId] = [];
      _lastSpeedTimestamp[taskId] = DateTime.now().millisecondsSinceEpoch;
      _lastDownloadedBytes[taskId] = 0;

      await _apiClient.streamDownloadFile(
        downloadUrl: downloadUrl,
        savePath: tempPartPath,
        cancelToken: cancelToken,
        onReceiveProgress: (received, total) {
          if (cancelToken.isCancelled) return;
          _onByteProgress(taskId, received, total);
        },
      );

      if (cancelToken.isCancelled) return;

      final tempFile = File(tempPartPath);
      if (await tempFile.exists()) {
        final size = await tempFile.length();
        if (size > 0) {
          final targetFile = File(finalFilePath);
          if (await targetFile.exists()) {
            await targetFile.delete();
          }
          await tempFile.rename(finalFilePath);

          _stopElapsedTimer(taskId);
          _cleanTaskResources(taskId);

          final completedTask = state.firstWhere((t) => t.id == taskId);
          _updateTask(taskId, (t) => t.copyWith(
                status: DownloadStatus.completed,
                progress: 1.0,
                downloadedBytes: size,
                totalBytes: size,
                filePath: finalFilePath,
                completedAt: DateTime.now(),
              ));

          // Save to Android Gallery
          try {
            const platform = MethodChannel('com.unisave.unisave_app/gallery');
            await platform.invokeMethod('saveToGallery', {
              'filePath': finalFilePath,
              'isVideo': !completedTask.formatId.contains('audio'),
            });
          } catch (e) {
            debugPrint('[DownloadManager] Gallery save error: $e');
          }

          // Auto-record to history
          _ref.read(historyProvider.notifier).addHistoryItem(completedTask);

          _processQueue();
          return;
        }
      }

      throw Exception('Downloaded file was empty.');
    } catch (e) {
      if (cancelToken.isCancelled) return;
      _handleTaskFailure(taskId, e.toString(), allowRetry: true);
    }
  }

  void _onByteProgress(String taskId, int received, int total) {
    final now = DateTime.now().millisecondsSinceEpoch;
    final lastTime = _lastSpeedTimestamp[taskId] ?? now;
    final lastBytes = _lastDownloadedBytes[taskId] ?? 0;
    final timeDelta = (now - lastTime) / 1000.0;

    double speed = 0.0;
    if (timeDelta >= 0.5) {
      final bytesDelta = received - lastBytes;
      final instantSpeed = bytesDelta / timeDelta;

      final history = _speedHistory[taskId] ?? [];
      history.add(instantSpeed.toInt());
      if (history.length > 5) history.removeAt(0);
      _speedHistory[taskId] = history;

      speed = history.reduce((a, b) => a + b) / history.length;
      _lastSpeedTimestamp[taskId] = now;
      _lastDownloadedBytes[taskId] = received;
    }

    int? eta;
    if (total > 0 && speed > 0) {
      final remainingBytes = total - received;
      eta = (remainingBytes / speed).ceil();
    }

    final progress = total > 0 ? (received / total).clamp(0.0, 1.0) : 0.0;

    _updateTask(taskId, (t) => t.copyWith(
          downloadedBytes: received,
          totalBytes: total > 0 ? total : t.totalBytes,
          progress: progress,
          speedBytesPerSec: speed > 0 ? speed : t.speedBytesPerSec,
          etaSeconds: eta,
        ));
  }

  void _handleTaskFailure(String taskId, String error,
      {bool allowRetry = true}) {
    _stopElapsedTimer(taskId);
    _cleanTaskResources(taskId);

    final task =
        state.firstWhere((t) => t.id == taskId, orElse: () => state.first);

    if (allowRetry && task.retryCount < 3 && !error.contains('not found')) {
      final nextRetry = task.retryCount + 1;
      _updateTask(taskId, (t) => t.copyWith(
            status: DownloadStatus.queued,
            retryCount: nextRetry,
            errorMessage: 'Retrying ($nextRetry/3)...',
          ));
      final delaySec = nextRetry == 1 ? 1 : (nextRetry == 2 ? 3 : 7);
      Timer(Duration(seconds: delaySec), () {
        _startTaskExecution(taskId);
      });
      return;
    }

    _updateTask(taskId, (t) => t.copyWith(
          status: DownloadStatus.failed,
          errorMessage: _formatFriendlyError(error),
        ));

    _processQueue();
  }

  String _formatFriendlyError(String raw) {
    if (raw.contains('No internet') || raw.contains('SocketException')) {
      return 'Network lost. Check connection.';
    }
    if (raw.contains('timed out')) {
      return 'Connection timed out. Tap Retry.';
    }
    if (raw.contains('CANCELLED') || raw.contains('cancelled')) {
      return 'Download cancelled.';
    }
    if (raw.contains('404')) {
      return 'Media expired. Please analyze again.';
    }
    return raw.replaceAll('Exception:', '').trim();
  }

  void pauseDownload(String taskId) {
    _cancelTokens[taskId]?.cancel('Paused by user');
    _pollingTimers[taskId]?.cancel();
    _stopElapsedTimer(taskId);
    _cleanTaskResources(taskId);

    _updateTask(taskId, (t) => t.copyWith(status: DownloadStatus.paused));
    _processQueue();
  }

  void resumeDownload(String taskId) {
    _updateTask(taskId, (t) => t.copyWith(
          status: DownloadStatus.queued,
          errorMessage: null,
        ));
    _processQueue();
  }

  void cancelDownload(String taskId) async {
    _cancelTokens[taskId]?.cancel('User cancelled');
    _pollingTimers[taskId]?.cancel();
    _stopElapsedTimer(taskId);
    _cleanTaskResources(taskId);

    final task =
        state.firstWhere((t) => t.id == taskId, orElse: () => state.first);

    if (task.tempFilePath != null) {
      try {
        final f = File(task.tempFilePath!);
        if (await f.exists()) await f.delete();
      } catch (_) {}
    }

    _updateTask(taskId, (t) => t.copyWith(
          status: DownloadStatus.cancelled,
          errorMessage: 'Cancelled',
        ));

    _processQueue();
  }

  void removeTask(String taskId) async {
    cancelDownload(taskId);
    state = state.where((t) => t.id != taskId).toList();
    await _persistTasks();
  }

  void _cleanTaskResources(String taskId) {
    _cancelTokens.remove(taskId);
    _pollingTimers[taskId]?.cancel();
    _pollingTimers.remove(taskId);
    _speedHistory.remove(taskId);
    _lastSpeedTimestamp.remove(taskId);
    _lastDownloadedBytes.remove(taskId);
  }

  void _startElapsedTimer(String taskId) {
    _elapsedTimers[taskId]?.cancel();
    _elapsedTimers[taskId] = Timer.periodic(const Duration(seconds: 1), (_) {
      final task =
          state.firstWhere((t) => t.id == taskId, orElse: () => state.first);
      if (task.status == DownloadStatus.completed ||
          task.status == DownloadStatus.failed ||
          task.status == DownloadStatus.cancelled ||
          task.status == DownloadStatus.paused) {
        _stopElapsedTimer(taskId);
        return;
      }
      _updateTask(
          taskId, (t) => t.copyWith(elapsedSeconds: t.elapsedSeconds + 1));
    });
  }

  void _stopElapsedTimer(String taskId) {
    _elapsedTimers[taskId]?.cancel();
    _elapsedTimers.remove(taskId);
  }

  @override
  void dispose() {
    for (var t in _cancelTokens.values) {
      t.cancel();
    }
    for (var t in _pollingTimers.values) {
      t.cancel();
    }
    for (var t in _elapsedTimers.values) {
      t.cancel();
    }
    super.dispose();
  }
}

final downloadManagerProvider =
    StateNotifierProvider<DownloadManagerNotifier, List<DownloadTask>>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return DownloadManagerNotifier(apiClient, ref);
});

class FormatUtils {
  static String formatBytes(int bytes) {
    if (bytes <= 0) return '0 B';
    const suffixes = ['B', 'KB', 'MB', 'GB', 'TB'];
    final i = (log(bytes) / log(1024)).floor();
    final size = bytes / pow(1024, i);
    return '${size.toStringAsFixed(1)} ${suffixes[i]}';
  }

  static String formatSpeed(double bytesPerSec) {
    if (bytesPerSec <= 0) return '0 KB/s';
    if (bytesPerSec < 1024 * 1024) {
      return '${(bytesPerSec / 1024).toStringAsFixed(1)} KB/s';
    }
    return '${(bytesPerSec / (1024 * 1024)).toStringAsFixed(1)} MB/s';
  }

  static String formatEta(int? seconds) {
    if (seconds == null || seconds <= 0) return '';
    if (seconds < 60) return '${seconds}s remaining';
    final m = seconds ~/ 60;
    final s = seconds % 60;
    return '${m}m ${s}s remaining';
  }
}
