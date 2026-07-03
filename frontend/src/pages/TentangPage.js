import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, viewportOnce } from '../utils/motion';

function TentangPage() {
  return (
    <section className="pg">

      {/* PAGE HEADER */}
      <div className="pg-head">
        <div className="pg-head-inner">
          <motion.span
            className="sec-eyebrow"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Tentang sistem
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Cerdas, terbuka,<br />dan dapat dipercaya
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            Parahyangan menggunakan pendekatan Content-Based Filtering metode yang telah
            terbukti dalam dunia akademik maupun industri rekomendasi.
          </motion.p>
        </div>
      </div>

      <div className="pg-inner about-content">

        {/* STEPS */}
        <motion.div
          className="about-steps"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
          {[
            {
              num: '01',
              title: 'Text Preprocessing',
              desc: (
                <>
                  Setiap deskripsi destinasi dibersihkan melalui tahapan <em>case folding</em>,{' '}
                  <em>cleaning</em>, <em>tokenization</em>, <em>stopword removal</em>, dan{' '}
                  <em>stemming</em> menggunakan library Sastrawi yang dirancang khusus untuk
                  Bahasa Indonesia.
                </>
              ),
              tags: ['Sastrawi', 'NLTK', 'Python'],
            },
            {
              num: '02',
              title: 'TF-IDF Vectorization',
              desc: (
                <>
                  Teks yang sudah bersih dikonversi menjadi representasi numerik menggunakan{' '}
                  <em>Term Frequency Inverse Document Frequency</em>. Setiap destinasi
                  direpresentasikan sebagai vektor dalam ruang dimensi tinggi.
                </>
              ),
              tags: ['scikit-learn', 'Vector Space'],
            },
            {
              num: '03',
              title: 'Cosine Similarity',
              desc: (
                <>
                  Kemiripan dihitung berdasarkan <em>sudut kosinus</em> antara vektor TF-IDF.
                  Sistem mendukung dua mode: <em>item-to-item</em> (kemiripan antar destinasi)
                  dan <em>query-to-item</em> (kemiripan dengan deskripsi pengguna).
                </>
              ),
              tags: ['Similarity Metrics', 'Query-based Search'],
            },
          ].map((step, i) => (
            <motion.article
              key={step.num}
              className="about-step"
              variants={fadeUp}
              custom={i}
            >
              <div className="about-step-num">{step.num}</div>
              <div>
                <h2>{step.title}</h2>
                <p>{step.desc}</p>
                <div className="about-tags">
                  {step.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* INFO CARDS */}
        <motion.div
          className="about-info"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {[
            {
              title: 'Dataset',
              body: '331 destinasi wisata di Bandung Raya Kota Bandung, Kabupaten Bandung, dan Bandung Barat. Dikurasi dari berbagai sumber publik daring.',
            },
            {
              title: 'Teknologi',
              body: 'Backend: Python · Flask · scikit-learn · Sastrawi\nFrontend: React · React Router',
            },
            {
              title: 'Penelitian',
              body: 'Tugas Akhir Mira Aldina, Teknik Informatika, Universitas Islam Nusantara, 2026.',
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              className="about-info-card"
              variants={fadeUp}
              custom={i}
            >
              <h3>{card.title}</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{card.body}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default TentangPage;