import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'auth_service.dart';

final authProvider = StateNotifierProvider<AuthNotifier, AsyncValue<bool>>((ref) {
  return AuthNotifier(ref.read(authServiceProvider));
});

class AuthNotifier extends StateNotifier<AsyncValue<bool>> {
  final AuthService _authService;
  final _storage = const FlutterSecureStorage();

  AuthNotifier(this._authService) : super(const AsyncValue.data(false));

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final token = await _authService.login(email, password);
      await _storage.write(key: 'access_token', value: token);
      state = const AsyncValue.data(true);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: 'access_token');
    state = const AsyncValue.data(false);
  }
}
