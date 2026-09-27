import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

import 'download_manager.dart';

class DownloadsScreen extends ConsumerWidget {
  const DownloadsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tasks = ref.watch(downloadManagerProvider);

    final activeTasks = tasks
        .where((t) =>
            t.status == DownloadStatus.resolving ||
            t.status == DownloadStatus.starting ||
            t.status == DownloadStatus.downloading ||
            t.status == DownloadStatus.paused)
        .toList();

    final queuedTasks =
        tasks.where((t) => t.status == DownloadStatus.queued).toList();

    final completedTasks =
        tasks.where((t) => t.status == DownloadStatus.completed).toList();

    final failedTasks = tasks
        .where((t) =>
            t.status == DownloadStatus.failed ||
            t.status == DownloadStatus.cancelled)
        .toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Downloads'),
        actions: [
          if (completedTasks.isNotEmpty || failedTasks.isNotEmpty)
            PopupMenuButton<String>(
              onSelected: (val) {
                if (val == 'clear_completed') {
                  for (var t in completedTasks) {
                    ref.read(downloadManagerProvider.notifier).removeTask(t.id);
                  }
                } else if (val == 'clear_failed') {
                  for (var t in failedTasks) {
                    ref.read(downloadManagerProvider.notifier).removeTask(t.id);
                  }
                }
              },
              itemBuilder: (ctx) => [
                if (completedTasks.isNotEmpty)
                  const PopupMenuItem(
                    value: 'clear_completed',
                    child: Text('Clear completed'),
                  ),
                if (failedTasks.isNotEmpty)
                  const PopupMenuItem(
                    value: 'clear_failed',
                    child: Text('Clear failed'),
                  ),
              ],
            ),
        ],
      ),
      body: tasks.isEmpty
          ? _buildEmptyState(context)
          : ListView(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              children: [
                if (activeTasks.isNotEmpty) ...[
                  _SectionHeader(title: 'ACTIVE', count: activeTasks.length),
                  ...activeTasks.map((t) => _ActiveDownloadCard(task: t)),
                  const SizedBox(height: 16),
                ],
                if (queuedTasks.isNotEmpty) ...[
                  _SectionHeader(title: 'QUEUED', count: queuedTasks.length),
                  ...queuedTasks.asMap().entries.map((e) =>
                      _QueuedDownloadCard(task: e.value, position: e.key + 1)),
                  const SizedBox(height: 16),
                ],
                if (completedTasks.isNotEmpty) ...[
                  _SectionHeader(
                      title: 'COMPLETED', count: completedTasks.length),
                  ...completedTasks.map((t) => _CompletedDownloadCard(task: t)),
                  const SizedBox(height: 16),
                ],
                if (failedTasks.isNotEmpty) ...[
                  _SectionHeader(
                      title: 'FAILED / CANCELLED', count: failedTasks.length),
                  ...failedTasks.map((t) => _FailedDownloadCard(task: t)),
                ],
              ],
            ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.inbox_outlined,
              size: 80, color: Colors.grey.withOpacity(0.3)),
          const SizedBox(height: 16),
          const Text(
            'Your downloads will appear here.',
            style: TextStyle(
                color: Colors.grey, fontSize: 16, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          const Text(
            'Paste a media link on Home to get started.',
            style: TextStyle(color: Colors.white38, fontSize: 13),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final int count;
  const _SectionHeader({required this.title, required this.count});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10, left: 4),
      child: Row(
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.4,
              color: Colors.grey,
            ),
          ),
          const SizedBox(width: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
            decoration: BoxDecoration(
              color: Colors.white12,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              '$count',
              style: const TextStyle(
                  fontSize: 10,
                  color: Colors.grey,
                  fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── 1. ACTIVE DOWNLOAD CARD ────────────────────────────────────────────────

class _ActiveDownloadCard extends ConsumerWidget {
  final DownloadTask task;
  const _ActiveDownloadCard({required this.task});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final primary = Theme.of(context).colorScheme.primary;
    final isResolving = task.status == DownloadStatus.resolving;
    final isStarting = task.status == DownloadStatus.starting;
    final isPaused = task.status == DownloadStatus.paused;
    final isDownloading = task.status == DownloadStatus.downloading;

    String statusText = 'Downloading...';
    if (isResolving) statusText = 'Resolving media...';
    if (isStarting) statusText = 'Preparing download stream...';
    if (isPaused) statusText = 'Paused';

    final percentText = (task.progress * 100).toStringAsFixed(0);
    final sizeText = task.totalBytes > 0
        ? '${FormatUtils.formatBytes(task.downloadedBytes)} / ${FormatUtils.formatBytes(task.totalBytes)}'
        : FormatUtils.formatBytes(task.downloadedBytes);

    final speedText = isDownloading && task.speedBytesPerSec > 0
        ? FormatUtils.formatSpeed(task.speedBytesPerSec)
        : '';
    final etaText = isDownloading && task.etaSeconds != null
        ? FormatUtils.formatEta(task.etaSeconds)
        : '';

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: primary.withOpacity(0.35)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header: Thumbnail + Title + Platform/Quality
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _Thumbnail(url: task.thumbnail),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        task.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${task.platform.toUpperCase()} • ${task.quality}',
                        style: TextStyle(
                          color: primary,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Progress Bar
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: isResolving || isStarting
                  ? LinearProgressIndicator(
                      minHeight: 6,
                      backgroundColor: primary.withOpacity(0.15),
                    )
                  : LinearProgressIndicator(
                      value: task.progress,
                      minHeight: 6,
                      backgroundColor: primary.withOpacity(0.15),
                      valueColor: isPaused
                          ? const AlwaysStoppedAnimation(Colors.amber)
                          : null,
                    ),
            ),
            const SizedBox(height: 10),

            // Metrics row: Size / Speed / ETA
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  isResolving || isStarting
                      ? statusText
                      : '$percentText% • $sizeText',
                  style: const TextStyle(
                      fontSize: 12, fontWeight: FontWeight.w600),
                ),
                if (isDownloading &&
                    (speedText.isNotEmpty || etaText.isNotEmpty))
                  Text(
                    speedText.isNotEmpty && etaText.isNotEmpty
                        ? '$speedText • $etaText'
                        : speedText.isNotEmpty
                            ? speedText
                            : etaText,
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                if (isPaused)
                  const Text(
                    'Paused',
                    style: TextStyle(
                        fontSize: 12,
                        color: Colors.amber,
                        fontWeight: FontWeight.bold),
                  ),
              ],
            ),
            const SizedBox(height: 12),

            // Action Buttons: Pause / Resume / Cancel
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                if (isDownloading)
                  TextButton.icon(
                    onPressed: () => ref
                        .read(downloadManagerProvider.notifier)
                        .pauseDownload(task.id),
                    icon: const Icon(Icons.pause_rounded, size: 16),
                    label: const Text('Pause'),
                  )
                else if (isPaused)
                  TextButton.icon(
                    onPressed: () => ref
                        .read(downloadManagerProvider.notifier)
                        .resumeDownload(task.id),
                    icon: const Icon(Icons.play_arrow_rounded, size: 16),
                    label: const Text('Resume'),
                  ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () => ref
                      .read(downloadManagerProvider.notifier)
                      .cancelDownload(task.id),
                  icon: const Icon(Icons.close_rounded, size: 16),
                  label: const Text('Cancel'),
                  style:
                      TextButton.styleFrom(foregroundColor: Colors.redAccent),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ─── 2. QUEUED DOWNLOAD CARD ────────────────────────────────────────────────

class _QueuedDownloadCard extends ConsumerWidget {
  final DownloadTask task;
  final int position;
  const _QueuedDownloadCard({required this.task, required this.position});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: const BorderSide(color: Colors.white10),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            _Thumbnail(url: task.thumbnail),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    task.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                        fontWeight: FontWeight.w600, fontSize: 13),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.amber.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          'Queued • Position #$position',
                          style: const TextStyle(
                            color: Colors.amber,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${task.platform.toUpperCase()} • ${task.quality}',
                        style:
                            const TextStyle(color: Colors.grey, fontSize: 11),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            IconButton(
              icon:
                  const Icon(Icons.close_rounded, size: 18, color: Colors.grey),
              onPressed: () => ref
                  .read(downloadManagerProvider.notifier)
                  .cancelDownload(task.id),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── 3. COMPLETED DOWNLOAD CARD ─────────────────────────────────────────────

class _CompletedDownloadCard extends ConsumerWidget {
  final DownloadTask task;
  const _CompletedDownloadCard({required this.task});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sizeText = FormatUtils.formatBytes(
        task.totalBytes > 0 ? task.totalBytes : task.downloadedBytes);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.green.withOpacity(0.3)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                _Thumbnail(url: task.thumbnail),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        task.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          const Icon(Icons.check_circle_rounded,
                              color: Colors.green, size: 14),
                          const SizedBox(width: 4),
                          Text(
                            'Completed • $sizeText • ${task.quality}',
                            style: const TextStyle(
                                color: Colors.green,
                                fontSize: 11,
                                fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _ActionButton(
                  icon: Icons.play_arrow_rounded,
                  label: 'Open / Play',
                  onTap: () async {
                    if (task.filePath != null) {
                      try {
                        const platform =
                            MethodChannel('com.unisave.unisave_app/gallery');
                        await platform.invokeMethod('openMediaFile', {
                          'filePath': task.filePath,
                        });
                      } catch (e) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('File at: ${task.filePath}')),
                        );
                      }
                    }
                  },
                ),
                _ActionButton(
                  icon: Icons.share_rounded,
                  label: 'Share',
                  onTap: () {
                    if (task.filePath != null) {
                      Share.shareXFiles([XFile(task.filePath!)],
                          text: task.title);
                    }
                  },
                ),
                _ActionButton(
                  icon: Icons.delete_outline_rounded,
                  label: 'Delete',
                  color: Colors.redAccent,
                  onTap: () => _confirmDelete(context, ref),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _confirmDelete(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete download?'),
        content: const Text(
            'This will remove the download and its local file from device storage.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              if (task.filePath != null) {
                try {
                  final f = File(task.filePath!);
                  if (await f.exists()) await f.delete();
                } catch (_) {}
              }
              ref.read(downloadManagerProvider.notifier).removeTask(task.id);
              Navigator.pop(ctx);
            },
            child:
                const Text('Delete', style: TextStyle(color: Colors.redAccent)),
          ),
        ],
      ),
    );
  }
}

// ─── 4. FAILED / CANCELLED CARD ─────────────────────────────────────────────

class _FailedDownloadCard extends ConsumerWidget {
  final DownloadTask task;
  const _FailedDownloadCard({required this.task});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isCancelled = task.status == DownloadStatus.cancelled;

    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: BorderSide(
            color: isCancelled ? Colors.white12 : Colors.red.withOpacity(0.3)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            _Thumbnail(url: task.thumbnail),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    task.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                        fontWeight: FontWeight.w600, fontSize: 13),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    task.errorMessage ??
                        (isCancelled ? 'Cancelled' : 'Download failed'),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: isCancelled ? Colors.grey : Colors.redAccent,
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            if (!isCancelled)
              IconButton(
                icon: const Icon(Icons.refresh_rounded,
                    size: 20, color: Colors.white70),
                tooltip: 'Retry',
                onPressed: () => ref
                    .read(downloadManagerProvider.notifier)
                    .resumeDownload(task.id),
              ),
            IconButton(
              icon:
                  const Icon(Icons.close_rounded, size: 18, color: Colors.grey),
              tooltip: 'Remove',
              onPressed: () => ref
                  .read(downloadManagerProvider.notifier)
                  .removeTask(task.id),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── SHARED THUMBNAIL & BUTTON ──────────────────────────────────────────────

class _Thumbnail extends StatelessWidget {
  final String? url;
  const _Thumbnail({this.url});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: url != null && url!.isNotEmpty
          ? Image.network(
              url!,
              width: 52,
              height: 52,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => _placeholder(),
            )
          : _placeholder(),
    );
  }

  Widget _placeholder() => Container(
        width: 52,
        height: 52,
        color: Colors.white10,
        child: const Icon(Icons.movie_outlined, color: Colors.grey, size: 24),
      );
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color? color;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.onTap,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return TextButton.icon(
      onPressed: onTap,
      icon: Icon(icon, size: 16),
      label: Text(label, style: const TextStyle(fontSize: 12)),
      style: TextButton.styleFrom(
        foregroundColor: color ?? Theme.of(context).colorScheme.primary,
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      ),
    );
  }
}
