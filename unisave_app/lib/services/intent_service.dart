import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:receive_sharing_intent/receive_sharing_intent.dart';
import 'package:go_router/go_router.dart';

import '../core/router/app_router.dart';
import '../features/analyzer/analyzer_provider.dart';

// Provides access to the intent service
final intentServiceProvider = Provider<IntentService>((ref) {
  return IntentService(ref);
});

class IntentService {
  final Ref _ref;
  StreamSubscription? _intentDataStreamSubscription;

  IntentService(this._ref);

  void initialize() {
    // 1. For sharing or opening URLs/text coming from outside the app while the app is in the memory
    _intentDataStreamSubscription =
        ReceiveSharingIntent.instance.getMediaStream().listen(
      (List<SharedMediaFile> value) {
        if (value.isNotEmpty) {
          _handleSharedText(
            value.first.path,
          ); // Text/URLs come through path in recent versions
        }
      },
      onError: (err) {
        debugPrint("ReceiveSharingIntent error: $err");
      },
    );

    // 2. For sharing or opening URLs/text coming from outside the app while the app is closed
    ReceiveSharingIntent.instance.getInitialMedia().then((
      List<SharedMediaFile> value,
    ) {
      if (value.isNotEmpty) {
        _handleSharedText(value.first.path);
      }
    });
  }

  void _handleSharedText(String text) {
    // Extract URL if the shared text contains extra words (e.g. "Check out this video! https://...")
    final urlRegex = RegExp(r'(https?:\/\/[^\s]+)');
    final match = urlRegex.firstMatch(text);

    if (match != null) {
      final url = match.group(0)!;

      // Navigate to Home if not already there
      final context = rootNavigatorKey.currentContext;
      if (context != null) {
        context.go('/');

        // Show a brief snackbar
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Media link detected from share!'),
            backgroundColor: Theme.of(context).colorScheme.primary,
            duration: const Duration(seconds: 2),
          ),
        );

        // Trigger analysis automatically
        // Alternatively, we could just populate the text field, but direct analysis feels more premium.
        _ref.read(analyzerProvider.notifier).analyzeUrl(url);
      }
    }
  }

  void dispose() {
    _intentDataStreamSubscription?.cancel();
  }
}
