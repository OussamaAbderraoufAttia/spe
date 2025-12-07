import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';
import '../../../../core/api/api_client.dart';

final incidentServiceProvider = Provider<IncidentService>((ref) {
  return IncidentService(ref.read(apiProvider));
});

class Incident {
  final int id;
  final String title;
  final String status; // PENDING, COMPLETED, etc.
  final String description;
  final LatLng location;
  final String? imageUrl;

  Incident({
    required this.id,
    required this.title,
    required this.status,
    required this.description,
    required this.location,
    this.imageUrl,
  });

  factory Incident.fromJson(Map<String, dynamic> json) {
    return Incident(
      id: json['id'],
      title: json['title'],
      status: json['status'],
      description: json['description'] ?? '',
      location: LatLng(json['latitude'], json['longitude']),
      imageUrl: json['media_url'], // Assuming API returns media_url
    );
  }
}

class IncidentService {
  final Dio _dio;

  IncidentService(this._dio);

  Future<List<Incident>> getIncidents() async {
    try {
      final response = await _dio.get('/incidents/');
      return (response.data as List).map((e) => Incident.fromJson(e)).toList();
    } catch (e) {
      throw Exception('Failed to load incidents');
    }
  }

  Future<void> createIncident({
    required String title,
    required String description,
    required int categoryId,
    required double lat,
    required double lon,
    String? imagePath,
  }) async {
    try {
      final data = FormData.fromMap({
        'title': title,
        'description': description,
        'category_id': categoryId,
        'latitude': lat,
        'longitude': lon,
        if (imagePath != null) 'image': await MultipartFile.fromFile(imagePath),
      });

      await _dio.post('/incidents/', data: data);
    } catch (e) {
      throw Exception('Failed to create incident: $e');
    }
  }
}
