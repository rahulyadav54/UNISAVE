import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../analyzer/analyzer_provider.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final TextEditingController _urlController = TextEditingController();
  bool _isAnalyzing = false;
  int _elapsedSeconds = 0;
  Timer? _elapsedTimer;
  String _statusMessage = 'Analyzing media...';

  static const _statusMessages = [
    'Analyzing media...',
    'Contacting server...',
    'Fetching media info...',
    'Reading available formats...',
    'Almost there...',
  ];
  int _statusIndex = 0;

  @override
  void dispose() {
    _urlController.dispose();
    _elapsedTimer?.cancel();
    super.dispose();
  }

  void _startLoadingTimer() {
    _elapsedSeconds = 0;
    _statusIndex = 0;
    _statusMessage = _statusMessages[0];
    _elapsedTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      setState(() {
        _elapsedSeconds++;
        // Cycle through descriptive messages every 4 seconds
        if (_elapsedSeconds % 4 == 0) {
          _statusIndex = (_statusIndex + 1) % _statusMessages.length;
          _statusMessage = _statusMessages[_statusIndex];
        }
      });
    });
  }

  void _stopLoadingTimer() {
    _elapsedTimer?.cancel();
    _elapsedTimer = null;
    setState(() {
      _elapsedSeconds = 0;
      _isAnalyzing = false;
    });
  }

  void _analyzeUrl() {
    final url = _urlController.text.trim();
    if (url.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a media URL first.')),
      );
      return;
    }

    // Basic URL check
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a valid URL starting with https://'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    setState(() => _isAnalyzing = true);
    _startLoadingTimer();
    ref.read(analyzerProvider.notifier).analyzeUrl(url);
  }

  void _cancelAnalysis() {
    ref.read(analyzerProvider.notifier).reset();
    _stopLoadingTimer();
  }

  void _pasteFromClipboard() async {
    final data = await Clipboard.getData(Clipboard.kTextPlain);
    if (data?.text != null && data!.text!.isNotEmpty) {
      setState(() => _urlController.text = data.text!.trim());
    }
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<AnalyzerState>(analyzerProvider, (previous, next) {
      if (next is AnalyzerError) {
        _stopLoadingTimer();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.message),
            backgroundColor: Colors.redAccent,
            duration: const Duration(seconds: 5),
          ),
        );
      } else if (next is AnalyzerSuccess) {
        _stopLoadingTimer();
        context.push(
          '/result',
          extra: {
            'result': next.result,
            'originalUrl': _urlController.text.trim(),
          },
        );
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'UNISAVE',
          style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'One Link. One Place.\nSave What Matters.',
              style: TextStyle(
                fontSize: 26,
                height: 1.3,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 32),

            // URL Input Card
            Card(
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 4.0, vertical: 2),
                child: Row(
                  children: [
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16.0),
                      child: Icon(Icons.link, color: Colors.grey),
                    ),
                    Expanded(
                      child: TextField(
                        controller: _urlController,
                        enabled: !_isAnalyzing,
                        decoration: const InputDecoration(
                          hintText: 'Paste media URL here...',
                          border: InputBorder.none,
                        ),
                        keyboardType: TextInputType.url,
                        onChanged: (_) => setState(() {}),
                        onSubmitted: (_) {
                          if (!_isAnalyzing) _analyzeUrl();
                        },
                      ),
                    ),
                    if (_urlController.text.isNotEmpty && !_isAnalyzing)
                      IconButton(
                        icon: const Icon(Icons.clear, size: 20),
                        onPressed: () {
                          _urlController.clear();
                          setState(() {});
                        },
                      )
                    else if (!_isAnalyzing)
                      IconButton(
                        icon: const Icon(Icons.content_paste,
                            size: 20, color: Colors.grey),
                        onPressed: _pasteFromClipboard,
                        tooltip: 'Paste',
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Analyze / Loading Button
            if (!_isAnalyzing)
              ElevatedButton(
                onPressed: _analyzeUrl,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'Analyze',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              )
            else
              _buildLoadingCard(context),

            const SizedBox(height: 48),

            // Supported Platforms
            const Text(
              'Supported Platforms',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              runSpacing: 10,
              children: const [
                _PlatformChip('YouTube'),
                _PlatformChip('Instagram'),
                _PlatformChip('TikTok'),
                _PlatformChip('Facebook'),
                _PlatformChip('X / Twitter'),
                _PlatformChip('Reddit'),
                _PlatformChip('Pinterest'),
                _PlatformChip('Vimeo'),
                _PlatformChip('Threads'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingCard(BuildContext context) {
    final primary = Theme.of(context).colorScheme.primary;
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: primary.withOpacity(0.4)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              children: [
                SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.5,
                    color: primary,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 400),
                        child: Text(
                          _statusMessage,
                          key: ValueKey(_statusMessage),
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 15,
                          ),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _elapsedSeconds > 8
                            ? 'This may take up to 30 seconds on first run...'
                            : '$_elapsedSeconds seconds elapsed',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: _cancelAnalysis,
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.redAccent,
                  side: const BorderSide(color: Colors.redAccent),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text('Cancel'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PlatformChip extends StatelessWidget {
  final String name;
  const _PlatformChip(this.name);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white12),
      ),
      child: Text(
        name,
        style: const TextStyle(fontSize: 13, color: Colors.white70),
      ),
    );
  }
}
