import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/models/media_models.dart';
import '../downloads/download_manager.dart';

class ResultScreen extends ConsumerStatefulWidget {
  final AnalyzeResult result;
  final String originalUrl; // We need this for the download API

  const ResultScreen({
    super.key,
    required this.result,
    required this.originalUrl,
  });

  @override
  ConsumerState<ResultScreen> createState() => _ResultScreenState();
}

class _ResultScreenState extends ConsumerState<ResultScreen> {
  String _selectedFormatId = '';

  @override
  void initState() {
    super.initState();
    final videoFormats =
        widget.result.formats.where((f) => f.type == 'video').toList();
    if (videoFormats.isNotEmpty) {
      _selectedFormatId = videoFormats.first.id;
    } else if (widget.result.formats.isNotEmpty) {
      _selectedFormatId = widget.result.formats.first.id;
    }
  }

  void _startDownload() {
    if (_selectedFormatId.isEmpty) return;

    final selectedFormat = widget.result.formats.firstWhere(
      (f) => f.id == _selectedFormatId,
      orElse: () => widget.result.formats.first,
    );

    final qualityLabel = selectedFormat.quality ??
        selectedFormat.resolution ??
        selectedFormat.label ??
        'Best';

    ref.read(downloadManagerProvider.notifier).enqueueDownload(
          url: widget.originalUrl,
          formatId: _selectedFormatId,
          title: widget.result.media.title ?? 'UNISAVE Media',
          platform: widget.result.platform,
          quality: qualityLabel,
          thumbnail: widget.result.media.thumbnail,
        );

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Download added to queue.'),
        duration: Duration(seconds: 2),
      ),
    );
    context.go('/downloads'); // Switch to downloads tab
  }

  @override
  Widget build(BuildContext context) {
    final media = widget.result.media;
    final formats = widget.result.formats;

    // Group formats by type
    final videoFormats = formats.where((f) => f.type == 'video').toList();
    final audioFormats = formats.where((f) => f.type == 'audio').toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Result'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Thumbnail
            if (media.thumbnail != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.network(
                  media.thumbnail!,
                  height: 220,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    height: 220,
                    color: Colors.grey.withOpacity(0.2),
                    child: const Icon(Icons.image_not_supported, size: 48),
                  ),
                ),
              ),
            const SizedBox(height: 24),

            // Info Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color:
                        Theme.of(context).colorScheme.primary.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.video_library,
                        size: 16,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        media.platform.toUpperCase(),
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.primary,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                if (media.duration != null && media.duration! > 0)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.grey.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      _formatDuration(media.duration!),
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 16),

            // Title
            Text(
              media.title ?? 'Unknown Media',
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                height: 1.3,
              ),
            ),
            if (media.creator != null) ...[
              const SizedBox(height: 8),
              Text(
                'by ${media.creator}',
                style: const TextStyle(fontSize: 14, color: Colors.grey),
              ),
            ],

            const SizedBox(height: 32),
            const Divider(color: Colors.white12),
            const SizedBox(height: 24),

            // Format Selection
            const Text(
              'Select Quality',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            if (videoFormats.isNotEmpty) ...[
              const Text(
                'Video',
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
              const SizedBox(height: 8),
              ...videoFormats.map(
                (f) => _FormatTile(
                  format: f,
                  isSelected: _selectedFormatId == f.id,
                  onTap: () => setState(() => _selectedFormatId = f.id),
                ),
              ),
              const SizedBox(height: 16),
            ],

            if (audioFormats.isNotEmpty) ...[
              const Text(
                'Audio Only',
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
              const SizedBox(height: 8),
              ...audioFormats.map(
                (f) => _FormatTile(
                  format: f,
                  isSelected: _selectedFormatId == f.id,
                  onTap: () => setState(() => _selectedFormatId = f.id),
                ),
              ),
            ],

            const SizedBox(height: 32),

            // Download Button
            ElevatedButton.icon(
              onPressed: _selectedFormatId.isEmpty ? null : _startDownload,
              icon: const Icon(Icons.download),
              label: const Text(
                'Download',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  String _formatDuration(int seconds) {
    final d = Duration(seconds: seconds);
    final minutes = d.inMinutes;
    final remainingSeconds = (seconds % 60).toString().padLeft(2, '0');
    if (d.inHours > 0) {
      final hours = d.inHours;
      final remainingMinutes = (minutes % 60).toString().padLeft(2, '0');
      return '$hours:$remainingMinutes:$remainingSeconds';
    }
    return '$minutes:$remainingSeconds';
  }
}

class _FormatTile extends StatelessWidget {
  final MediaFormat format;
  final bool isSelected;
  final VoidCallback onTap;

  const _FormatTile({
    required this.format,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      color: isSelected
          ? Theme.of(context).colorScheme.primary.withOpacity(0.15)
          : null,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: isSelected
              ? Theme.of(context).colorScheme.primary
              : Colors.white12,
          width: isSelected ? 2 : 1,
        ),
      ),
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        onTap: onTap,
        title: Text(
          format.quality ?? format.resolution ?? 'Standard',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(format.label ?? format.format.toUpperCase()),
        trailing: isSelected
            ? Icon(
                Icons.check_circle,
                color: Theme.of(context).colorScheme.primary,
              )
            : const Icon(Icons.radio_button_unchecked, color: Colors.grey),
      ),
    );
  }
}
