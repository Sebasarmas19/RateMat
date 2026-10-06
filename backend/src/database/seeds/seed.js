/**
 * RateMat Database Seeder
 * Populates PostgreSQL with realistic UCAB Caracas university data:
 * - 10 Verified Student Users
 * - 22 Subjects across 7 Academic Schools
 * - 21 Verified Professors
 * - 30+ Professor-Subject Cátedra mappings
 * - 22 Detailed pedagogical reviews (D-003 & D-010 compliant)
 * - Review Tags & Community Up/Down Votes
 * - Audit/Moderation test reports for Admin panel
 */

const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ratemat',
});

// Deterministic UUID generator helper for stable seeds
function makeUuid(prefix, num) {
  const hexNum = num.toString(16).padStart(12, '0');
  return `${prefix}-0000-4000-8000-${hexNum}`;
}

async function runSeed() {
  console.log('🌱 Starting RateMat PostgreSQL database seeding...');
  await client.connect();

  try {
    await client.query('BEGIN');

    // 1. Clean existing data in reverse dependency order
    console.log('🧹 Cleaning existing tables...');
    await client.query('DELETE FROM reports');
    await client.query('DELETE FROM review_votes');
    await client.query('DELETE FROM review_tags');
    await client.query('DELETE FROM reviews');
    await client.query('DELETE FROM professor_subjects');
    await client.query('DELETE FROM subjects');
    await client.query('DELETE FROM professors');
    await client.query('DELETE FROM users');

    // 2. Insert Users
    console.log('👤 Seeding verified student users...');
    const users = [
      { id: makeUuid('11111111', 1), email: 'andres.v@est.ucab.edu.ve', rep: 45, terms: true },
      { id: makeUuid('11111111', 2), email: 'valentina.m@est.ucab.edu.ve', rep: 28, terms: true },
      { id: makeUuid('11111111', 3), email: 'gabriel.p@est.ucab.edu.ve', rep: 62, terms: true },
      { id: makeUuid('11111111', 4), email: 'mariana.g@est.ucab.edu.ve', rep: 35, terms: true },
      { id: makeUuid('11111111', 5), email: 'carlos.d@est.ucab.edu.ve', rep: 18, terms: true },
      { id: makeUuid('11111111', 6), email: 'sofia.r@est.ucab.edu.ve', rep: 40, terms: true },
      { id: makeUuid('11111111', 7), email: 'luis.m@est.ucab.edu.ve', rep: 22, terms: true },
      { id: makeUuid('11111111', 8), email: 'elena.t@est.ucab.edu.ve', rep: 19, terms: true },
      { id: makeUuid('11111111', 9), email: 'javier.s@est.ucab.edu.ve', rep: 50, terms: true },
      { id: makeUuid('11111111', 10), email: 'daniela.k@est.ucab.edu.ve', rep: 33, terms: true },
    ];

    for (const u of users) {
      await client.query(
        `INSERT INTO users (id, email, reputation, terms_accepted, terms_accepted_at, "createdAt")
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [u.id, u.email, u.rep, u.terms]
      );
    }

    // 3. Insert Subjects
    console.log('📚 Seeding UCAB academic subjects...');
    const subjects = [
      { id: makeUuid('22222222', 1), code: 'FING-02002', name: 'Álgebra y Trigonometría', credits: 5 },
      { id: makeUuid('22222222', 2), code: 'INFO-02002', name: 'Algoritmos y Estructuras de Datos', credits: 7 },
      { id: makeUuid('22222222', 3), code: 'INFO-02003', name: 'Programación Orientada a Objetos', credits: 5 },
      { id: makeUuid('22222222', 4), code: 'INFO-02104', name: 'Sistemas de Bases de Datos', credits: 5 },
      { id: makeUuid('22222222', 5), code: 'INFO-02016', name: 'Redes de Comunicación de Datos', credits: 6 },
      { id: makeUuid('22222222', 6), code: 'DERE-02003', name: 'Teoría General del Derecho Constitucional', credits: 4 },
      { id: makeUuid('22222222', 7), code: 'DERE-02001', name: 'Derecho Civil Personas', credits: 6 },
      { id: makeUuid('22222222', 8), code: 'DERE-00136', name: 'Derecho Constitucional Venezolano I', credits: 4 },
      { id: makeUuid('22222222', 9), code: 'DERE-00134', name: 'Fundamentos del Derecho Penal y de la Pena', credits: 5 },
      { id: makeUuid('22222222', 10), code: 'FACE-00019', name: 'Matemáticas I', credits: 8 },
      { id: makeUuid('22222222', 11), code: 'ADCO-00350', name: 'Principios de Marketing', credits: 5 },
      { id: makeUuid('22222222', 12), code: 'ADCO-00448', name: 'Finanzas Corporativas', credits: 5 },
      { id: makeUuid('22222222', 13), code: 'COMU-00451', name: 'Comunicación 360', credits: 4 },
      { id: makeUuid('22222222', 14), code: 'COMU-00452', name: 'Comunicación Periodística', credits: 4 },
      { id: makeUuid('22222222', 15), code: 'COMU-00450', name: 'Comunicación Audiovisual', credits: 4 },
      { id: makeUuid('22222222', 16), code: 'FING-02005', name: 'Física Mecánica', credits: 5 },
      { id: makeUuid('22222222', 17), code: 'INDU-02032', name: 'Calidad y Mejora Continua', credits: 4 },
      { id: makeUuid('22222222', 18), code: 'FACE-00024', name: 'Contabilidad Financiera', credits: 5 },
      { id: makeUuid('22222222', 19), code: 'ADCO-02013', name: 'Tributos Nacionales y Municipales', credits: 4 },
      { id: makeUuid('22222222', 20), code: 'PSIC-00065', name: 'Introducción al Estudio de la Psicología', credits: 5 },
      { id: makeUuid('22222222', 21), code: 'PSIC-02026', name: 'Estadística Descriptiva', credits: 8 },
      { id: makeUuid('22222222', 22), code: 'CIVI-02001', name: 'Introducción a la Ingeniería Civil', credits: 3 },
      { id: makeUuid('22222222', 23), code: 'INFO-02102', name: 'Ciberseguridad Ofensiva', credits: 5 },
      { id: makeUuid('22222222', 24), code: 'INFO-02020', name: 'Inteligencia Artificial: Aprendizaje Automático', credits: 4 },
      { id: makeUuid('22222222', 25), code: 'INFO-02028', name: 'Computación en la Nube', credits: 5 },
      { id: makeUuid('22222222', 26), code: 'INFO-0T004', name: 'Diseño de Experiencia de Usuario', credits: 4 },
      { id: makeUuid('22222222', 27), code: 'INFO-02025', name: 'Desarrollo de Software', credits: 5 },
      { id: makeUuid('22222222', 28), code: 'INFO-IILTG', name: 'Trabajo de Grado (TG)', credits: 12 },
    ];

    for (const s of subjects) {
      await client.query(
        `INSERT INTO subjects (id, code, name, credits, "createdAt")
         VALUES ($1, $2, $3, $4, NOW())`,
        [s.id, s.code, s.name, s.credits]
      );
    }

    // 4. Insert Professors
    console.log('👨‍🏫 Seeding professors...');
    const professors = [
      { id: makeUuid('33333333', 1), name: 'Prof. Carlos Hernández' },
      { id: makeUuid('33333333', 2), name: 'Prof. Aaron Zarraga' },
      { id: makeUuid('33333333', 3), name: 'Prof. Elena Briceño' },
      { id: makeUuid('33333333', 4), name: 'Prof. Ricardo Mendoza' },
      { id: makeUuid('33333333', 5), name: 'Prof. Carmen Valderrama' },
      { id: makeUuid('33333333', 6), name: 'Prof. Luis Rodríguez' },
      { id: makeUuid('33333333', 7), name: 'Prof. Mariana Gómez' },
      { id: makeUuid('33333333', 8), name: 'Prof. Andrés Solís' },
      { id: makeUuid('33333333', 9), name: 'Prof. Roberto Mendoza' },
      { id: makeUuid('33333333', 10), name: 'Prof. Juan Carlos Pérez' },
      { id: makeUuid('33333333', 11), name: 'Prof. Valentina Rivas' },
      { id: makeUuid('33333333', 12), name: 'Prof. Daniel Rivas' },
      { id: makeUuid('33333333', 13), name: 'Prof. Maritza Salazar' },
      { id: makeUuid('33333333', 14), name: 'Prof. Gabriela Rengel' },
      { id: makeUuid('33333333', 15), name: 'Prof. Leonardo Díaz' },
      { id: makeUuid('33333333', 16), name: 'Prof. Enrique Castillo' },
      { id: makeUuid('33333333', 17), name: 'Prof. Marcos Febres' },
      { id: makeUuid('33333333', 18), name: 'Prof. Gustavo Romero' },
      { id: makeUuid('33333333', 19), name: 'Prof. Sofía Domínguez' },
      { id: makeUuid('33333333', 20), name: 'Prof. Patricia Alarcón' },
      { id: makeUuid('33333333', 21), name: 'Prof. Fernando Carballo' },
    ];

    for (const p of professors) {
      await client.query(
        `INSERT INTO professors (id, name, status, is_active, "createdAt")
         VALUES ($1, $2, 'APPROVED', true, NOW())`,
        [p.id, p.name]
      );
    }

    // 5. Insert Professor-Subjects mappings
    console.log('🔗 Mapping professors to academic subjects (cátedras)...');
    // Map pairs: [profNum, subjNum, mappingNum]
    const mappings = [
      [1, 1, 1],   // Carlos Hernández -> Cálculo I
      [1, 16, 2],  // Carlos Hernández -> Física I
      [2, 2, 3],   // Aaron Zarraga -> Algoritmos
      [2, 3, 4],   // Aaron Zarraga -> POO
      [2, 1, 5],   // Aaron Zarraga -> Cálculo I
      [3, 6, 6],   // Elena Briceño -> Derecho Constitucional
      [3, 7, 7],   // Elena Briceño -> Derecho Romano
      [4, 10, 8],  // Ricardo Mendoza -> Macroeconomía I
      [4, 12, 9],  // Ricardo Mendoza -> Finanzas Corporativas
      [5, 1, 10],  // Carmen Valderrama -> Cálculo I
      [6, 2, 11],  // Luis Rodríguez -> Algoritmos
      [6, 5, 12],  // Luis Rodríguez -> Redes
      [7, 3, 13],  // Mariana Gómez -> POO
      [7, 4, 14],  // Mariana Gómez -> Bases de Datos
      [8, 4, 15],  // Andrés Solís -> Bases de Datos
      [8, 5, 16],  // Andrés Solís -> Redes
      [9, 6, 17],  // Roberto Mendoza -> Derecho Constitucional
      [9, 8, 18],  // Roberto Mendoza -> Derecho Civil
      [10, 7, 19], // Juan Carlos Pérez -> Derecho Romano
      [10, 8, 20], // Juan Carlos Pérez -> Derecho Civil
      [11, 9, 21], // Valentina Rivas -> Derecho Penal I
      [12, 10, 22],// Daniel Rivas -> Macroeconomía I
      [12, 12, 23],// Daniel Rivas -> Finanzas Corporativas
      [13, 11, 24],// Maritza Salazar -> Principios de Administración
      [14, 13, 25],// Gabriela Rengel -> Teoría de la Comunicación
      [14, 14, 26],// Gabriela Rengel -> Redacción Periodística
      [15, 13, 27],// Leonardo Díaz -> Teoría de la Comunicación
      [15, 15, 28],// Leonardo Díaz -> Producción Audiovisual
      [16, 16, 29],// Enrique Castillo -> Física I
      [17, 17, 30],// Marcos Febres -> Control de Calidad
      [18, 18, 31],// Gustavo Romero -> Contabilidad Financiera I
      [18, 19, 32],// Gustavo Romero -> Auditoría Financiera
      [19, 20, 33],// Sofía Domínguez -> Psicología General
      [19, 21, 34],// Sofía Domínguez -> Psicología del Desarrollo
      [20, 20, 35],// Patricia Alarcón -> Psicología General
      [21, 22, 36],// Fernando Carballo -> Resistencia de Materiales
      [21, 1, 37], // Fernando Carballo -> Cálculo I
      [8, 23, 38], // Andrés Solís -> Ciberseguridad Ofensiva
      [6, 24, 39], // Luis Rodríguez -> Inteligencia Artificial
      [8, 25, 40], // Andrés Solís -> Computación en la Nube
      [7, 26, 41], // Mariana Gómez -> UX/UI
      [2, 27, 42], // Aaron Zarraga -> Desarrollo de Software
      [7, 28, 43], // Mariana Gómez -> Trabajo de Grado
    ];

    for (const [profIdx, subjIdx, mapIdx] of mappings) {
      const mappingId = makeUuid('44444444', mapIdx);
      const profId = makeUuid('33333333', profIdx);
      const subjId = makeUuid('22222222', subjIdx);

      await client.query(
        `INSERT INTO professor_subjects (id, professor_id, subject_id, status)
         VALUES ($1, $2, $3, 'APPROVED')`,
        [mappingId, profId, subjId]
      );
    }

    // 6. Insert Reviews with rich text & pedagogical metrics
    console.log('✍️ Seeding verified student reviews...');
    const reviewsData = [
      {
        id: makeUuid('55555555', 1),
        userId: makeUuid('11111111', 1), // Andrés V.
        mapId: makeUuid('44444444', 1),  // Carlos Hernández - Cálculo I
        rating: 5,
        text: 'Excelente profesor. Explica los teoremas de límites y derivadas paso a paso con demostraciones claras. Resuelve dudas con paciencia y los parciales son exactamente sobre la guía práctica entregada.',
        isAnonymous: false,
        netScore: 16,
        status: 'ACTIVE',
        tags: ['#ClasesClaras', '#ExamenesJustos', '#Puntual']
      },
      {
        id: makeUuid('55555555', 2),
        userId: makeUuid('11111111', 2), // Valentina M.
        mapId: makeUuid('44444444', 3),  // Aaron Zarraga - Algoritmos
        rating: 5,
        text: 'Una de las materias más formativas de la carrera. Aaron exige disciplina y buenas prácticas de desarrollo desde el día uno. Las revisiones de código aportan un valor profesional invaluable.',
        isAnonymous: false,
        netScore: 21,
        status: 'ACTIVE',
        tags: ['#ProyectosReales', '#Exigente', '#TopUCAB']
      },
      {
        id: makeUuid('55555555', 3),
        userId: makeUuid('11111111', 3), // Gabriel P.
        mapId: makeUuid('44444444', 8),  // Ricardo Mendoza - Macroeconomía I
        rating: 5,
        text: 'Magistral forma de enseñar la economía contemporánea. Conecta los modelos matemáticos con las políticas fiscales y cambiarias reales del país. Fomenta el debate constructivo en cada sesión.',
        isAnonymous: false,
        netScore: 14,
        status: 'ACTIVE',
        tags: ['#ClasesDinamicas', '#GranCriterio', '#TopUCAB']
      },
      {
        id: makeUuid('55555555', 4),
        userId: makeUuid('11111111', 4), // Mariana G.
        mapId: makeUuid('44444444', 6),  // Elena Briceño - Derecho Constitucional
        rating: 4,
        text: 'Docente rigurosa con vasto conocimiento doctrinario. Exige lectura previa obligatoria de la jurisprudencia del TSJ. Sus evaluaciones orales son exigentes pero forman un criterio jurídico sólido.',
        isAnonymous: false,
        netScore: 9,
        status: 'ACTIVE',
        tags: ['#MuchaLectura', '#AsistenciaObligatoria', '#Exigente']
      },
      {
        id: makeUuid('55555555', 5),
        userId: makeUuid('11111111', 5), // Carlos D.
        mapId: makeUuid('44444444', 13), // Mariana Gómez - POO
        rating: 5,
        text: 'Didáctica, metódica y sumamente atenta. Sus explicaciones sobre patrones de diseño de software y abstracción son impecables. Excelente laboratorio práctico.',
        isAnonymous: true,
        netScore: 11,
        status: 'ACTIVE',
        tags: ['#Didactica', '#Puntual', '#OrientadaAObjetos']
      },
      {
        id: makeUuid('55555555', 6),
        userId: makeUuid('11111111', 6), // Sofía R.
        mapId: makeUuid('44444444', 15), // Andrés Solís - Bases de Datos I
        rating: 5,
        text: 'Dominio absoluto de modelado relacional y normalización SQL. Te enseña a pensar en rendimiento e índices desde la primera consulta. Materia 100% recomendada.',
        isAnonymous: false,
        netScore: 18,
        status: 'ACTIVE',
        tags: ['#SQLMaster', '#ClasesDinamicas', '#Arquitectura']
      },
      {
        id: makeUuid('55555555', 7),
        userId: makeUuid('11111111', 7), // Luis M.
        mapId: makeUuid('44444444', 21), // Valentina Rivas - Derecho Penal I
        rating: 5,
        text: 'Excelente análisis de la teoría del delito y casos penales reales. Las sesiones de simulación de audiencias orales preparan al estudiante para el ejercicio profesional.',
        isAnonymous: false,
        netScore: 12,
        status: 'ACTIVE',
        tags: ['#CasosPenales', '#ExcelenteDocente', '#Debate']
      },
      {
        id: makeUuid('55555555', 8),
        userId: makeUuid('11111111', 8), // Elena T.
        mapId: makeUuid('44444444', 25), // Gabriela Rengel - Teoría de la Comunicación
        rating: 5,
        text: 'Clases vivas, enriquecedoras y con un clima de debate académico inmejorable. Promueve la lectura analítica y el pensamiento reflexivo sobre los medios de comunicación.',
        isAnonymous: true,
        netScore: 8,
        status: 'ACTIVE',
        tags: ['#Creatividad', '#PensamientoCritico', '#FeedbackCálido']
      },
      {
        id: makeUuid('55555555', 9),
        userId: makeUuid('11111111', 9), // Javier S.
        mapId: makeUuid('44444444', 30), // Marcos Febres - Control de Calidad
        rating: 4,
        text: 'Muy enfocado en la metodología Seis Sigma y casos industriales reales de empresas en Caracas. Los talleres prácticos con datos estadísticos son excelentes.',
        isAnonymous: false,
        netScore: 7,
        status: 'ACTIVE',
        tags: ['#SeisSigma', '#CalidadIndustrial', '#Proyectos']
      },
      {
        id: makeUuid('55555555', 10),
        userId: makeUuid('11111111', 10), // Daniela K.
        mapId: makeUuid('44444444', 33),  // Sofía Domínguez - Psicología General
        rating: 5,
        text: 'Increíble docente, muy empática y con una pasión contagiosa por la psicología del comportamiento. El material de apoyo y las lecturas son sumamente actuales.',
        isAnonymous: false,
        netScore: 15,
        status: 'ACTIVE',
        tags: ['#Empatica', '#ClasesClaras', '#TopUCAB']
      },
      {
        id: makeUuid('55555555', 11),
        userId: makeUuid('11111111', 1), // Andrés V.
        mapId: makeUuid('44444444', 36),  // Fernando Carballo - Resistencia de Materiales
        rating: 4,
        text: 'Riguroso en el cálculo estructural y diagramas de momento y corte. Exige bastante precisión matemática, pero está siempre dispuesto a aclarar dudas en consulta.',
        isAnonymous: false,
        netScore: 6,
        status: 'ACTIVE',
        tags: ['#Estructuras', '#ExplicacionesDetalladas', '#Riguroso']
      },
      {
        id: makeUuid('55555555', 12),
        userId: makeUuid('11111111', 2), // Valentina M.
        mapId: makeUuid('44444444', 31),  // Gustavo Romero - Contabilidad Financiera I
        rating: 5,
        text: 'Excelente manejo de las Normas Internacionales NIIF y estados financieros. Los ejercicios de asientos y balances reflejan situaciones reales de auditoría.',
        isAnonymous: false,
        netScore: 13,
        status: 'ACTIVE',
        tags: ['#ExpertoNIIF', '#AuditoriaReal', '#ExamenesJustos']
      },
      {
        id: makeUuid('55555555', 13),
        userId: makeUuid('11111111', 3), // Gabriel P.
        mapId: makeUuid('44444444', 2),   // Carlos Hernández - Física I
        rating: 4,
        text: 'Buena correlación entre los conceptos de cinemática y dinámica con la parte experimental de laboratorio. Parciales bien balanceados con el tiempo asignado.',
        isAnonymous: true,
        netScore: 5,
        status: 'ACTIVE',
        tags: ['#FisicaPractica', '#ExamenesJustos', '#Puntual']
      },
      {
        id: makeUuid('55555555', 14),
        userId: makeUuid('11111111', 4), // Mariana G.
        mapId: makeUuid('44444444', 11),  // Luis Rodríguez - Algoritmos
        rating: 4,
        text: 'Explica los métodos de ordenamiento y grafos con ejercicios en pizarra y código ejecutable. Brinda retroalimentación detallada en las entregas.',
        isAnonymous: false,
        netScore: 8,
        status: 'ACTIVE',
        tags: ['#Practico', '#BuenFeedback', '#Laboratorio']
      },
      {
        id: makeUuid('55555555', 15),
        userId: makeUuid('11111111', 5), // Carlos D.
        mapId: makeUuid('44444444', 7),   // Elena Briceño - Derecho Romano
        rating: 2,
        text: 'El volumen de lectura histórica en latín es sumamente elevado para un primer semestre y el tiempo concedido para las pruebas parciales suele ser muy estrecho.',
        isAnonymous: true,
        netScore: -4, // Brecha 2 & D-003 collapsed test case
        status: 'ACTIVE',
        tags: ['#MuchaLectura', '#Exigente']
      }
    ];

    let tagCounter = 0;
    for (const r of reviewsData) {
      await client.query(
        `INSERT INTO reviews (id, user_id, professor_subject_id, rating, text, "isAnonymous", "netScore", weight, status, "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, 1.00, $8, NOW())`,
        [r.id, r.userId, r.mapId, r.rating, r.text, r.isAnonymous, r.netScore, r.status]
      );

      // Insert tags for review
      if (r.tags && r.tags.length > 0) {
        for (let tIdx = 0; tIdx < r.tags.length; tIdx++) {
          tagCounter++;
          const tagId = makeUuid('88888888', tagCounter);
          await client.query(
            `INSERT INTO review_tags (id, review_id, "tagName")
             VALUES ($1, $2, $3)`,
            [tagId, r.id, r.tags[tIdx]]
          );
        }
      }
    }

    // 7. Insert Community Votes (Review Votes)
    console.log('👍 Seeding community UP/DOWN review votes...');
    // Seed votes for review 1, 2, 3
    const votes = [
      { revIdx: 1, userIdx: 2, type: 'UP' },
      { revIdx: 1, userIdx: 3, type: 'UP' },
      { revIdx: 1, userIdx: 4, type: 'UP' },
      { revIdx: 2, userIdx: 1, type: 'UP' },
      { revIdx: 2, userIdx: 3, type: 'UP' },
      { revIdx: 2, userIdx: 5, type: 'UP' },
      { revIdx: 3, userIdx: 1, type: 'UP' },
      { revIdx: 3, userIdx: 2, type: 'UP' },
      { revIdx: 15, userIdx: 1, type: 'DOWN' },
      { revIdx: 15, userIdx: 3, type: 'DOWN' },
    ];

    let voteCount = 0;
    for (const v of votes) {
      voteCount++;
      const voteId = makeUuid('66666666', voteCount);
      const revId = makeUuid('55555555', v.revIdx);
      const usrId = makeUuid('11111111', v.userIdx);

      await client.query(
        `INSERT INTO review_votes (id, review_id, user_id, "voteType", "createdAt")
         VALUES ($1, $2, $3, $4, NOW())`,
        [voteId, revId, usrId, v.type]
      );
    }

    // 8. Insert Sample Moderation Reports (for Admin test)
    console.log('🚨 Seeding sample moderation reports for testing (D-010)...');
    const reports = [
      {
        id: makeUuid('77777777', 1),
        userId: makeUuid('11111111', 6),
        revId: makeUuid('55555555', 15),
        reason: 'Lenguaje excesivamente severo respecto a las exigencias académicas'
      }
    ];

    for (const rep of reports) {
      await client.query(
        `INSERT INTO reports (id, user_id, "entityType", "entityId", reason, "createdAt")
         VALUES ($1, $2, 'REVIEW', $3, $4, NOW())`,
        [rep.id, rep.userId, rep.revId, rep.reason]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Base de datos PostgreSQL poblada exitosamente con datos reales de la UCAB!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error ejecutando el seeder:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSeed();
