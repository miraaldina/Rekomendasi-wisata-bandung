"""
Backend API - Sistem Rekomendasi Destinasi Wisata Bandung
Framework: Flask
Metode: Content-Based Filtering (TF-IDF + Cosine Similarity)

Endpoints:
    GET  /                            -> Info API
    GET  /api/destinations            -> Daftar semua destinasi
    GET  /api/categories              -> Daftar kategori wisata
    GET  /api/cities                  -> Daftar kota/wilayah
    POST /api/recommendations         -> Rekomendasi berdasarkan nama destinasi
    POST /api/recommendations-by-text -> Rekomendasi berdasarkan deskripsi (query bebas)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.metrics.pairwise import cosine_similarity
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
import pickle
import re
import os

# ============================================================
# INISIALISASI FLASK
# ============================================================
app = Flask(__name__)
CORS(app)

# ============================================================
# LOAD MODEL & DATA
# ============================================================
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'model')

print("Memuat model...")

with open(os.path.join(MODEL_DIR, 'tfidf_vectorizer.pkl'), 'rb') as f:
    tfidf_vectorizer = pickle.load(f)

with open(os.path.join(MODEL_DIR, 'tfidf_matrix.pkl'), 'rb') as f:
    tfidf_matrix = pickle.load(f)

with open(os.path.join(MODEL_DIR, 'cosine_sim_matrix.pkl'), 'rb') as f:
    cosine_sim_matrix = pickle.load(f)

with open(os.path.join(MODEL_DIR, 'dataset_processed.pkl'), 'rb') as f:
    df = pickle.load(f)

# Inisialisasi Sastrawi untuk preprocessing query user
stopword_factory = StopWordRemoverFactory()
stopwords_id = stopword_factory.get_stop_words()
stemmer = StemmerFactory().create_stemmer()

print(f"Model berhasil dimuat! ({len(df)} destinasi)")


# ============================================================
# FUNGSI PREPROCESSING (sama persis dengan notebook)
# ============================================================
def preprocess_text(text):
    """Case folding, cleaning, tokenization, stopword removal, stemming"""
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    tokens = text.split()
    tokens = [word for word in tokens if word not in stopwords_id]
    tokens = [stemmer.stem(word) for word in tokens]
    return ' '.join(tokens)


# ============================================================
# FUNGSI REKOMENDASI BERDASARKAN NAMA DESTINASI
# ============================================================
def get_recommendations_by_place(place_name, top_n=5, city_filter=None, category_filter=None):
    """Rekomendasi berdasarkan kemiripan dengan destinasi tertentu."""
    matches = df[df['Place_Name'].str.lower() == place_name.lower()]

    if len(matches) == 0:
        return None

    idx = matches.index[0]

    sim_scores = list(enumerate(cosine_sim_matrix[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:]  # Skip diri sendiri

    if city_filter:
        sim_scores = [(i, score) for i, score in sim_scores
                      if df.iloc[i]['City'].lower() == city_filter.lower()]

    if category_filter:
        sim_scores = [(i, score) for i, score in sim_scores
                      if df.iloc[i]['Category'].lower() == category_filter.lower()]

    top_results = sim_scores[:top_n]

    recommendations = []
    for rank, (i, score) in enumerate(top_results, 1):
        recommendations.append({
            'rank': rank,
            'place_id': int(df.iloc[i]['Place_Id']),
            'place_name': df.iloc[i]['Place_Name'],
            'description': df.iloc[i]['Description'],
            'category': df.iloc[i]['Category'],
            'city': df.iloc[i]['City'],
            'similarity_score': round(float(score), 4)
        })

    return recommendations


# ============================================================
# FUNGSI REKOMENDASI BERDASARKAN DESKRIPSI/QUERY BEBAS
# ============================================================
def get_recommendations_by_text(query_text, top_n=6, city_filter=None, category_filter=None):
    """
    Rekomendasi berdasarkan query teks bebas dari user.

    Tahapan:
    1. Query user di-preprocessing (case folding, stopword removal, stemming)
    2. Query ditransformasi ke vektor TF-IDF (pakai vectorizer yang SUDAH dilatih)
    3. Hitung cosine similarity vektor query dengan semua destinasi
    4. Return top-N destinasi dengan skor tertinggi
    """
    # 1. Preprocessing query user (sama persis seperti dataset saat training)
    query_processed = preprocess_text(query_text)

    if not query_processed.strip():
        return None, query_processed

    # 2. Transform ke vektor TF-IDF
    # PENTING: pakai transform(), BUKAN fit_transform()
    # supaya vocabulary tetap konsisten dengan dataset training
    query_vector = tfidf_vectorizer.transform([query_processed])

    # 3. Hitung cosine similarity antara query dengan semua destinasi
    sim_scores = cosine_similarity(query_vector, tfidf_matrix).flatten()

    # 4. Urutkan berdasarkan skor tertinggi
    indexed_scores = list(enumerate(sim_scores))
    indexed_scores = sorted(indexed_scores, key=lambda x: x[1], reverse=True)

    # Filter destinasi dengan skor > 0
    indexed_scores = [(i, s) for i, s in indexed_scores if s > 0]

    # Filter kota & kategori jika diminta
    if city_filter:
        indexed_scores = [(i, score) for i, score in indexed_scores
                          if df.iloc[i]['City'].lower() == city_filter.lower()]

    if category_filter:
        indexed_scores = [(i, score) for i, score in indexed_scores
                          if df.iloc[i]['Category'].lower() == category_filter.lower()]

    top_results = indexed_scores[:top_n]

    recommendations = []
    for rank, (i, score) in enumerate(top_results, 1):
        recommendations.append({
            'rank': rank,
            'place_id': int(df.iloc[i]['Place_Id']),
            'place_name': df.iloc[i]['Place_Name'],
            'description': df.iloc[i]['Description'],
            'category': df.iloc[i]['Category'],
            'city': df.iloc[i]['City'],
            'similarity_score': round(float(score), 4)
        })

    return recommendations, query_processed


# ============================================================
# ENDPOINT API
# ============================================================

@app.route('/')
def home():
    return jsonify({
        'nama_sistem': 'Sistem Rekomendasi Destinasi Wisata Bandung',
        'metode': 'Content-Based Filtering (TF-IDF + Cosine Similarity)',
        'jumlah_destinasi': len(df),
        'endpoints': {
            'GET /api/destinations': 'Daftar semua destinasi',
            'GET /api/categories': 'Daftar kategori wisata',
            'GET /api/cities': 'Daftar kota/wilayah',
            'POST /api/recommendations': 'Rekomendasi berdasarkan nama destinasi',
            'POST /api/recommendations-by-text': 'Rekomendasi berdasarkan deskripsi (query bebas)',
        }
    })


@app.route('/api/destinations', methods=['GET'])
def get_destinations():
    city = request.args.get('city', None)
    category = request.args.get('category', None)
    search = request.args.get('search', None)

    filtered = df.copy()
    if city:
        filtered = filtered[filtered['City'].str.lower() == city.lower()]
    if category:
        filtered = filtered[filtered['Category'].str.lower() == category.lower()]
    if search:
        filtered = filtered[filtered['Place_Name'].str.lower().str.contains(search.lower())]

    destinations = []
    for _, row in filtered.iterrows():
        destinations.append({
            'place_id': int(row['Place_Id']),
            'place_name': row['Place_Name'],
            'description': row['Description'],
            'category': row['Category'],
            'city': row['City'],
        })

    return jsonify({'total': len(destinations), 'data': destinations})


@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = df['Category'].value_counts().to_dict()
    result = [{'name': k, 'count': v} for k, v in categories.items()]
    return jsonify({'total': len(result), 'data': result})


@app.route('/api/cities', methods=['GET'])
def get_cities():
    cities = df['City'].value_counts().to_dict()
    result = [{'name': k, 'count': v} for k, v in cities.items()]
    return jsonify({'total': len(result), 'data': result})


@app.route('/api/recommendations', methods=['POST'])
def recommendations():
    """Rekomendasi berdasarkan nama destinasi"""
    data = request.get_json()

    if not data or 'place_name' not in data:
        return jsonify({'error': True, 'message': 'Parameter "place_name" wajib diisi.'}), 400

    place_name = data['place_name']
    top_n = min(int(data.get('top_n', 5)), 20)
    city_filter = data.get('city', None)
    category_filter = data.get('category', None)

    results = get_recommendations_by_place(place_name, top_n, city_filter, category_filter)

    if results is None:
        suggestions = df[df['Place_Name'].str.lower().str.contains(
            place_name.lower()
        )]['Place_Name'].tolist()[:5]
        return jsonify({
            'error': True,
            'message': f'Destinasi "{place_name}" tidak ditemukan.',
            'suggestions': suggestions
        }), 404

    input_data = df[df['Place_Name'].str.lower() == place_name.lower()].iloc[0]

    return jsonify({
        'error': False,
        'mode': 'by_place',
        'input': {
            'place_name': input_data['Place_Name'],
            'description': input_data['Description'],
            'category': input_data['Category'],
            'city': input_data['City'],
        },
        'total_recommendations': len(results),
        'recommendations': results
    })


@app.route('/api/recommendations-by-text', methods=['POST'])
def recommendations_by_text():
    """Rekomendasi berdasarkan deskripsi/query bebas dari user"""
    data = request.get_json()

    if not data or 'query' not in data:
        return jsonify({'error': True, 'message': 'Parameter "query" wajib diisi.'}), 400
    query = data['query'].strip()

    if len(query) < 3:
        return jsonify({
            'error': True,
            'message': 'Deskripsi terlalu pendek. Mohon ketik minimal 3 karakter.'
        }), 400

    top_n = min(int(data.get('top_n', 6)), 20)
    city_filter = data.get('city', None)
    category_filter = data.get('category', None)

    results, query_processed = get_recommendations_by_text(
        query, top_n, city_filter, category_filter
    )

    if results is None or len(results) == 0:
        return jsonify({
            'error': True,
            'message': 'Tidak ditemukan destinasi yang sesuai. '
                       'Coba dengan kata kunci yang lebih umum, contoh: "wisata alam pegunungan".',
            'query_original': query,
            'query_processed': query_processed,
        })

    return jsonify({
        'error': False,
        'mode': 'by_text',
        'input': {
            'query_original': query,
            'query_processed': query_processed,
        },
        'total_recommendations': len(results),
        'recommendations': results
    })


# ============================================================
# JALANKAN SERVER
# ============================================================
if __name__ == '__main__':
    print("\n" + "=" * 50)
    print("Server Flask berjalan!")
    print("=" * 50)
    print(f"   URL: http://localhost:5000")
    print(f"   Destinasi: {len(df)} data")
    print(f"   Endpoint baru: POST /api/recommendations-by-text")
    print(f"   Tekan Ctrl+C untuk menghentikan server")
    print("=" * 50 + "\n")

    app.run(debug=True, port=5000)
