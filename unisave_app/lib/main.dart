import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/router/app_router.dart';
import 'services/intent_service.dart';

import 'package:shared_preferences/shared_preferences.dart';

import 'features/history/history_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final prefs = await SharedPreferences.getInstance();

  runApp(
    ProviderScope(
      overrides: [sharedPrefsProvider.overrideWithValue(prefs)],
      child: const UnisaveApp(),
    ),
  );
}

class UnisaveApp extends ConsumerStatefulWidget {
  const UnisaveApp({super.key});

  @override
  ConsumerState<UnisaveApp> createState() => _UnisaveAppState();
}

class _UnisaveAppState extends ConsumerState<UnisaveApp> {
  @override
  void initState() {
    super.initState();
    // Initialize the intent service for Share-To-UNISAVE
    Future.microtask(() => ref.read(intentServiceProvider).initialize());
  }

  @override
  Widget build(BuildContext context) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'UNISAVE',
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      themeMode: ThemeMode.dark, // Defaulting to dark as requested
      darkTheme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0F0F13),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF6B4BFF), // Electric blue/violet accent
          secondary: Color(0xFF8B5CF6),
          surface: Color(0xFF1C1C22),
          background: Color(0xFF0F0F13),
        ),
        cardTheme: CardThemeData(
          color: const Color(0xFF1C1C22),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: Color(0xFF2D2D36)),
          ),
          elevation: 0,
        ),
        navigationBarTheme: NavigationBarThemeData(
          backgroundColor: const Color(0xFF0F0F13),
          indicatorColor: const Color(0xFF6B4BFF).withOpacity(0.2),
          iconTheme: MaterialStateProperty.resolveWith((states) {
            if (states.contains(MaterialState.selected)) {
              return const IconThemeData(color: Color(0xFF6B4BFF));
            }
            return const IconThemeData(color: Colors.grey);
          }),
          labelTextStyle: MaterialStateProperty.resolveWith((states) {
            if (states.contains(MaterialState.selected)) {
              return const TextStyle(
                color: Color(0xFF6B4BFF),
                fontWeight: FontWeight.bold,
                fontSize: 12,
              );
            }
            return const TextStyle(color: Colors.grey, fontSize: 12);
          }),
        ),
      ),
    );
  }
}
