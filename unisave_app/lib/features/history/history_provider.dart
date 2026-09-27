import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../data/models/media_models.dart';
import '../downloads/download_manager.dart';

class HistoryItem {
  final String id;
  final String title;
  final String platform;
  final String format;
  final String? thumbnail;
  final String localPath;
  final DateTime date;

  HistoryItem({
    required this.id,
    required this.title,
    required this.platform,
    required this.format,
    this.thumbnail,
    required this.localPath,
    required this.date,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'platform': platform,
    'format': format,
    'thumbnail': thumbnail,
    'localPath': localPath,
    'date': date.toIso8601String(),
  };

  factory HistoryItem.fromJson(Map<String, dynamic> json) => HistoryItem(
    id: json['id'],
    title: json['title'],
    platform: json['platform'],
    format: json['format'],
    thumbnail: json['thumbnail'],
    localPath: json['localPath'],
    date: DateTime.parse(json['date']),
  );
}

final sharedPrefsProvider = Provider<SharedPreferences>(
  (ref) => throw UnimplementedError(),
);

class HistoryNotifier extends StateNotifier<List<HistoryItem>> {
  final SharedPreferences _prefs;
  static const _key = 'unisave_history';

  HistoryNotifier(this._prefs) : super([]) {
    _loadHistory();
  }

  void _loadHistory() {
    final jsonStringList = _prefs.getStringList(_key) ?? [];
    state =
        jsonStringList
            .map((jsonStr) => HistoryItem.fromJson(jsonDecode(jsonStr)))
            .toList()
          ..sort((a, b) => b.date.compareTo(a.date));
  }

  Future<void> addHistoryItem(DownloadTask task) async {
    if (task.filePath == null) return;

    final item = HistoryItem(
      id: task.id,
      title: task.title,
      platform: task.platform,
      format: task.quality,
      thumbnail: task.thumbnail,
      localPath: task.filePath!,
      date: DateTime.now(),
    );

    final newList = [item, ...state];
    state = newList;

    await _prefs.setStringList(
      _key,
      newList.map((i) => jsonEncode(i.toJson())).toList(),
    );
  }

  Future<void> clearHistory() async {
    state = [];
    await _prefs.remove(_key);
  }
}

final historyProvider =
    StateNotifierProvider<HistoryNotifier, List<HistoryItem>>((ref) {
      final prefs = ref.watch(sharedPrefsProvider);
      return HistoryNotifier(prefs);
    });
