import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/models/media_models.dart';
import '../../services/api_service.dart';

// Provider for the ApiService (You would typically inject the base URL from env variables)
final apiClientProvider = Provider<UnisaveApiClient>((ref) {
  return UnisaveApiClient(
    baseUrl: 'https://univideosaver.vercel.app',
  );
});

// State classes for the analysis
abstract class AnalyzerState {}

class AnalyzerInitial extends AnalyzerState {}

class AnalyzerLoading extends AnalyzerState {}

class AnalyzerSuccess extends AnalyzerState {
  final AnalyzeResult result;
  AnalyzerSuccess(this.result);
}

class AnalyzerError extends AnalyzerState {
  final String message;
  AnalyzerError(this.message);
}

// Notifier to handle the business logic of analyzing URLs
class AnalyzerNotifier extends StateNotifier<AnalyzerState> {
  final UnisaveApiClient _apiClient;

  AnalyzerNotifier(this._apiClient) : super(AnalyzerInitial());

  Future<void> analyzeUrl(String url) async {
    state = AnalyzerLoading();

    try {
      final result = await _apiClient.analyzeUrl(url);

      if (result.success) {
        state = AnalyzerSuccess(result);
      } else {
        state = AnalyzerError(result.error ?? 'Unknown error occurred.');
      }
    } catch (e) {
      state = AnalyzerError(e.toString());
    }
  }

  void reset() {
    state = AnalyzerInitial();
  }
}

final analyzerProvider = StateNotifierProvider<AnalyzerNotifier, AnalyzerState>(
  (ref) {
    final apiClient = ref.watch(apiClientProvider);
    return AnalyzerNotifier(apiClient);
  },
);
