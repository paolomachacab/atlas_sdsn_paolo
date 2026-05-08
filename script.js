/**
 * ═══════════════════════════════════════════════════════════════
 *  ATLAS TERRITORIAL BOLIVIA · script.js
 *  Lógica principal: mapas, datos Excel, GeoJSON, ODS
 * ═══════════════════════════════════════════════════════════════
 */

'use strict';

/* ══════════════════════════════════════════════════════ CONFIG */

/**
 * Lista de archivos de indicadores disponibles.
 * Para agregar un nuevo indicador: solo copiar el .xlsx en /data/indicadores/
 * y agregar el nombre del archivo a este array.
 * (GitHub Pages no permite listar directorios dinámicamente)
 */
const INDICATOR_FILES = [
  { file: '04_01_02_01_ash.xlsx', label: 'Abandono escolar — Hombres secundaria' },
  { file: '04_01_02_02_asm.xlsx', label: 'Abandono escolar — Mujeres secundaria' },
  { file: '04_02_02_03_pfp.xlsx', label: 'Asistencia preescolar (4-5 años)' },
  { file: '04_03_04_04_pes.xlsx', label: 'Educación superior (19 años o más)' },
  { file: '04_06_01_06_alf.xlsx', label: 'Tasa de alfabetización (15 años o más)' },
  { file: '04_10_01_09_pci.xlsx', label: 'Profesores calificados — Nivel inicial' },
  { file: '04_10_01_09_pcs.xlsx', label: 'Profesores calificados — Nivel secundario' },
  { file: '05_01_01_01_pga.xlsx', label: 'Paridad de género — Abandono escolar secundaria' },
  { file: '05_05_01_05_acm.xlsx', label: 'Concejales mujeres (%)' },
  { file: '11_01_01_01_thm.xlsx', label: 'Tasa de hacinamiento' },
  { file: '16_07_02_03_tcs.xlsx', label: 'Tasa de conflictividad social' },
];

const DATA_PATH      = 'data/indicadores/';
const GEOJSON_MUN    = 'data/geojson/municipios.geojson';
const GEOJSON_DEP    = 'data/geojson/departamentos.geojson';

/**
 * Detección automática de campos en el GeoJSON.
 * Compatible con el Shapefile: 343_Municipios_Corregidos_LCWGS84
 * Busca el campo ID y el campo Nombre en cualquier variante de nombre.
 */
const FIELD_CANDIDATES = {
  // Tu GeoJSON usa: COD (id) y MUNICIPIO (nombre)
  id:   ['COD', 'cod', 'COD_MUN', 'cod_mun', 'CODMUN', 'codmun',
          'INE', 'ine', 'CODIGO', 'codigo', 'ID', 'id', 'OBJECTID', 'GID'],
  name: ['MUNICIPIO', 'municipio', 'NOM_MUN', 'nom_mun', 'NOMBRE',
          'nombre', 'DEP_MUN_TI', 'NAME', 'name', 'NOM', 'nom'],
};

/** Detecta automáticamente qué campo usar como id y name en el GeoJSON */
function detectFields(geojson) {
  if (!geojson?.features?.length) return { idField: 'id', nameField: 'name' };
  const props = geojson.features[0].properties;
  const keys  = Object.keys(props);

  const idField   = FIELD_CANDIDATES.id.find(c => keys.includes(c))   || keys[0];
  const nameField = FIELD_CANDIDATES.name.find(c => keys.includes(c)) || keys[1] || keys[0];

  console.log(`[Atlas] Campos detectados → id: "${idField}", nombre: "${nameField}"`);
  console.log('[Atlas] Campos disponibles en GeoJSON:', keys);
  return { idField, nameField };
}

// Se llena al cargar el GeoJSON
let GEO_FIELDS = { idField: 'id', nameField: 'name' };

// Bolivia centroid / initial view
const BOLIVIA_CENTER = [-16.5, -64.5];
const BOLIVIA_ZOOM   = 6;

/* ODS Classification Colors */
const ODS_COLORS = {
  meta:    '#16a34a',
  proximo: '#ca8a04',
  retos:   '#ea580c',
  grandes: '#dc2626',
  sin:     '#d1d5db',
};

/* ══════════════════════════════════════════════════════ STATE */
const state = {
  level:          'municipal',   // 'municipal' | 'departamental'
  currentFile:    null,
  indicatorData:  null,   // { mun: Map<id, {v1,v2}>, dep: Map<id, {v1,v2}>, thresholds, colLabels }
  geoMun:         null,
  geoDep:         null,
  layerLeft:      null,
  layerRight:     null,
  selectedId:     null,
  isSyncing:      false,   // prevent sync loop
};

/* ══════════════════════════════════════════════════════ DOM REFS */
const $ = id => document.getElementById(id);
const dom = {
  indicatorSelect:   $('indicator-select'),
  munSearch:         $('municipality-search'),
  searchResults:     $('search-results'),
  legendContainer:   $('legend-container'),
  statsSection:      $('stats-section'),
  statsContainer:    $('stats-container'),
  munInfoSection:    $('mun-info-section'),
  munInfoCard:       $('mun-info-card'),
  loadingOverlay:    $('loading-overlay'),
  loadingText:       $('loading-text'),
  tooltip:           $('map-tooltip'),
  colLabelLeft:      $('col-label-left'),
  colLabelRight:     $('col-label-right'),
  btnMunicipal:      $('btn-municipal'),
  btnDep:            $('btn-departamental'),
  btnExport:         $('btn-export'),
  btnFullscreen:     $('btn-fullscreen'),
  mapsContainer:     $('maps-container'),
};

/* ══════════════════════════════════════════════════════ MAPS INIT */
let mapLeft, mapRight;

function initMaps() {
  const tileUrl = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
  const tileOpts = { attribution: '©OSM ©Carto', subdomains: 'abcd', maxZoom: 19 };

  // Bolivia bounding box completo: SW[-23.0, -69.7] NE[-9.6, -57.4]
  const boliviaBounds = L.latLngBounds([-23.0, -69.7], [-9.6, -57.4]);

  mapLeft = L.map('map-left', {
    zoomControl: true,
    attributionControl: false,
    maxBounds: boliviaBounds.pad(0.3),
  }).fitBounds(boliviaBounds);

  mapRight = L.map('map-right', {
    zoomControl: false,
    attributionControl: false,
    maxBounds: boliviaBounds.pad(0.3),
  }).fitBounds(boliviaBounds);

  L.tileLayer(tileUrl, tileOpts).addTo(mapLeft);
  L.tileLayer(tileUrl, tileOpts).addTo(mapRight);

  // Synchronize maps
  mapLeft.on('move', () => syncMap(mapLeft, mapRight));
  mapRight.on('move', () => syncMap(mapRight, mapLeft));
}

function syncMap(source, target) {
  if (state.isSyncing) return;
  state.isSyncing = true;
  target.setView(source.getCenter(), source.getZoom(), { animate: false });
  state.isSyncing = false;
}

/* ══════════════════════════════════════════════════════ GEOJSON LOADING */
async function loadGeoJSON() {
  setLoading(true, 'Cargando geometrías territoriales…');

  // Cargar municipios
  try {
    const munRes = await fetch(GEOJSON_MUN + '?v=' + Date.now()); // evitar caché
    if (munRes.ok) {
      const text = await munRes.text();
      try {
        state.geoMun = JSON.parse(text);
        GEO_FIELDS = detectFields(state.geoMun);
        console.log('[Atlas] GeoJSON cargado OK:', state.geoMun.features.length, 'features');
      } catch (parseErr) {
        console.error('[Atlas] GeoJSON municipios no disponible:', parseErr.message);
        console.error('[Atlas] Primeros 200 chars del archivo:', text.substring(0, 200));
        state.geoMun = null;
      }
    } else {
      console.error('[Atlas] GeoJSON HTTP error:', munRes.status);
      state.geoMun = null;
    }
  } catch (e) {
    console.warn('[Atlas] GeoJSON fetch error:', e);
    state.geoMun = null;
  }

  // Departamentos: desactivado (no hay archivo disponible)
  state.geoDep = null;

  setLoading(false);
}

/* ══════════════════════════════════════════════════════ INDICATOR FILES */
async function loadAvailableIndicators() {
  // Populate selector from INDICATOR_FILES config
  dom.indicatorSelect.innerHTML = '<option value="">— Seleccionar indicador —</option>';

  for (const ind of INDICATOR_FILES) {
    const opt = document.createElement('option');
    opt.value = ind.file;
    opt.textContent = ind.label;
    dom.indicatorSelect.appendChild(opt);
  }
}

/* ══════════════════════════════════════════════════════ EXCEL READING */

/**
 * Lee un archivo .xlsx y extrae datos de las hojas relevantes.
 * Retorna: { mun, dep, thresholds, colLabels }
 */
async function readExcel(filename) {
  setLoading(true, `Leyendo datos: ${filename}…`);

  const url = DATA_PATH + filename;
  let workbook;

  try {
    const res  = await fetch(url);
    const buf  = await res.arrayBuffer();
    workbook   = XLSX.read(buf, { type: 'array' });
  } catch (e) {
    console.error('Error cargando Excel:', e);
    setLoading(false);
    return null;
  }

  const result = {
    mun:        new Map(),
    dep:        new Map(),
    munAbs:     new Map(),
    depAbs:     new Map(),
    thresholds: null,
    colLabels:  { v1: '2012', v2: '2024' },
  };

  /* ── Hoja Indicador_MUN ── */
  if (workbook.SheetNames.includes('Indicador_MUN')) {
    const sheet = workbook.Sheets['Indicador_MUN'];
    const rows  = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (rows.length > 1) {
      const headers = rows[0];
      // Columnas: 0=id, 1=municipio, 2=v1, 3=v2  (independientemente del nombre)
      result.colLabels.v1 = headers[2] || '2012';
      result.colLabels.v2 = headers[3] || '2024';

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row[0]) continue;
        // Normalizar id a string entera (sin decimales): 10101.0 → "10101"
        const id  = String(Math.round(Number(row[0])) || row[0]).trim();
        const v1  = parseFloat(row[2]);
        const v2  = parseFloat(row[3]);
        result.mun.set(id, {
          name: row[1] || id,
          v1:   isNaN(v1) ? null : v1,
          v2:   isNaN(v2) ? null : v2,
        });
      }
    }
  }

  /* ── Hoja Absoluto_MUN ── */
  if (workbook.SheetNames.includes('Absoluto_MUN')) {
    const sheet = workbook.Sheets['Absoluto_MUN'];
    const rows  = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0]) continue;
      result.munAbs.set(String(row[0]).trim(), {
        v1: parseFloat(row[2]) || null,
        v2: parseFloat(row[3]) || null,
      });
    }
  }

  /* ── Hoja Indicador_DEP ── */
  if (workbook.SheetNames.includes('Indicador_DEP')) {
    const sheet = workbook.Sheets['Indicador_DEP'];
    const rows  = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0]) continue;
      result.dep.set(String(row[0]).trim(), {
        name: row[1] || String(row[0]),
        v1:   parseFloat(row[2]) || null,
        v2:   parseFloat(row[3]) || null,
      });
    }
  }

  /* ── Hoja Umbral ── */
  if (workbook.SheetNames.includes('Umbral')) {
    const sheet = workbook.Sheets['Umbral'];
    const rows  = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    // Estructura: [ODS, Indicador, meta_max, meta_min, proximo_max, proximo_min,
    //              retos_max, retos_min, grandes_max, grandes_min]
    if (rows.length > 1) {
      const r = rows[1]; // Primera fila de datos (fila 2)
      result.thresholds = {
        meta:    { max: parseFloat(r[2]), min: parseFloat(r[3]) },
        proximo: { max: parseFloat(r[4]), min: parseFloat(r[5]) },
        retos:   { max: parseFloat(r[6]), min: parseFloat(r[7]) },
        grandes: { max: parseFloat(r[8]), min: parseFloat(r[9]) },
      };
    }
  }

  setLoading(false);
  return result;
}

/* ══════════════════════════════════════════════════════ CLASSIFICATION */

/**
 * Clasifica un valor según los umbrales ODS.
 * Retorna: 'meta' | 'proximo' | 'retos' | 'grandes' | 'sin'
 */
function classify(value, thresholds) {
  if (value === null || value === undefined || isNaN(value)) return 'sin';
  if (!thresholds) return 'sin';

  const t = thresholds;

  // Determinar si el indicador es "mayor es mejor" o "menor es mejor"
  // basado en si meta_max > meta_min (ascendente) o meta_max < meta_min (descendente)
  const ascending = t.meta.max >= t.meta.min;

  if (ascending) {
    if (value >= t.meta.min)    return 'meta';
    if (value >= t.proximo.min) return 'proximo';
    if (value >= t.retos.min)   return 'retos';
    return 'grandes';
  } else {
    // Menor es mejor (ej. pobreza, abandono)
    if (value <= t.meta.max)    return 'meta';
    if (value <= t.proximo.max) return 'proximo';
    if (value <= t.retos.max)   return 'retos';
    return 'grandes';
  }
}

function classLabel(cat) {
  const labels = {
    meta:    'Meta alcanzada',
    proximo: 'Próximo a alcanzarse',
    retos:   'Quedan retos importantes',
    grandes: 'Quedan retos grandes',
    sin:     'Sin información',
  };
  return labels[cat] || 'Sin información';
}

function classStatusCSS(cat) {
  return `status-${cat === 'proximo' ? 'proximo' : cat}`;
}

/* ══════════════════════════════════════════════════════ MAP RENDERING */

/**
 * Estilo para una feature GeoJSON según período.
 */
function getFeatureId(feature) {
  const p = feature.properties;
  // Normalizar siempre a string sin decimales (ej: 40902.0 → "40902")
  const raw = p[GEO_FIELDS.idField] ??
    p.COD_MUN ?? p.cod_mun ?? p.CODMUN ?? p.ID ?? p.id ?? p.OBJECTID ?? '';
  return String(Math.round(Number(raw)) || raw).trim();
}

function getFeatureName(feature) {
  const p = feature.properties;
  return String(
    p[GEO_FIELDS.nameField] ??
    p.MUNICIPIO ?? p.municipio ?? p.NOMBRE ?? p.nombre ?? p.NAME ?? p.name ?? ''
  ).trim();
}

// Debug counter to check first few features
let _styleDebugCount = 0;

function featureStyle(feature, period, data, thresholds) {
  const id    = getFeatureId(feature);
  const entry = data.get(id);
  const val   = entry ? (period === 'left' ? entry.v1 : entry.v2) : null;
  const cat   = classify(val, thresholds);

  // Debug first 3 features
  if (_styleDebugCount < 3 && period === 'left') {
    console.log(`[Style] id="${id}" entry=${JSON.stringify(entry)} val=${val} cat=${cat}`);
    _styleDebugCount++;
  }

  return {
    fillColor:   ODS_COLORS[cat],
    fillOpacity: 0.85,
    color:       '#ffffff',
    weight:      0.5,
    opacity:     1,
  };
}

/**
 * Elimina capas anteriores y dibuja nuevas.
 */
function renderMaps() {
  _styleDebugCount = 0; // reset debug counter
  const data       = state.indicatorData;
  const munData    = data.mun;
  const depData    = data.dep;
  const thresholds = data.thresholds;
  const geo        = state.level === 'municipal' ? state.geoMun : state.geoDep;
  const mapData    = state.level === 'municipal' ? munData : depData;

  // Si no hay GeoJSON disponible, mostrar demo placeholder
  if (!geo) {
    renderDemoPlaceholder();
    return;
  }

  // Remove old layers
  if (state.layerLeft)  mapLeft.removeLayer(state.layerLeft);
  if (state.layerRight) mapRight.removeLayer(state.layerRight);

  function makeLayer(map, period) {
    return L.geoJSON(geo, {
      style: f => featureStyle(f, period, mapData, thresholds),
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: e => onFeatureHover(e, feature, period),
          mouseout:  () => hideTooltip(),
          click:     e => onFeatureClick(e, feature),
        });
      }
    }).addTo(map);
  }

  state.layerLeft  = makeLayer(mapLeft,  'left');
  state.layerRight = makeLayer(mapRight, 'right');

  // Fit bounds to the GeoJSON layer
  try {
    const bounds = state.layerLeft.getBounds();
    if (bounds.isValid()) {
      mapLeft.fitBounds(bounds, { padding: [20, 20], animate: false });
      mapRight.fitBounds(bounds, { padding: [20, 20], animate: false });
    } else {
      // Fallback: fit to Bolivia bounding box
      const boliviaBounds = L.latLngBounds([-23.0, -69.7], [-9.6, -57.4]);
      mapLeft.fitBounds(boliviaBounds, { padding: [20, 20], animate: false });
      mapRight.fitBounds(boliviaBounds, { padding: [20, 20], animate: false });
    }
  } catch (e) {
    const boliviaBounds = L.latLngBounds([-23.0, -69.7], [-9.6, -57.4]);
    mapLeft.fitBounds(boliviaBounds, { padding: [20, 20], animate: false });
    mapRight.fitBounds(boliviaBounds, { padding: [20, 20], animate: false });
  }
}

/* ══════════════════════════════════════════════════════ HOVER / TOOLTIP */

function onFeatureHover(e, feature, period) {
  const layer = e.target;

  layer.setStyle({
    weight:      2,
    color:       '#1d4ed8',
    fillOpacity: 0.95,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  showTooltip(e.originalEvent, feature);
}

function showTooltip(mouseEvent, feature) {
  const data   = state.indicatorData;
  const id     = getFeatureId(feature);
  const name   = getFeatureName(feature) || id;
  const props  = feature.properties;
  const entry  = (state.level === 'municipal' ? data.mun : data.dep).get(id);

  const v1  = entry?.v1;
  const v2  = entry?.v2;
  const cat = classify(v2 ?? v1, data.thresholds);

  const fmt   = v => v !== null && v !== undefined ? v.toFixed(1) : '—';
  const diff  = (v1 !== null && v2 !== null) ? (v2 - v1) : null;
  const sign  = diff !== null ? (diff > 0 ? '+' : '') : '';
  const diffClass = diff === null ? 'neutral' : diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral';

  // Datos extra del GeoJSON (departamento, provincia)
  const dpto     = props.DEPARTAMEN || props.departamen || '';
  const prov     = props.PROVINCIA  || props.provincia  || '';
  const location = [dpto, prov].filter(Boolean).join(' · ');

  dom.tooltip.innerHTML = `
    <div class="tooltip-name">${name}</div>
    ${location ? `<div style="font-size:11px;color:var(--text-light);margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid var(--border)">${location}</div>` : ''}
    <div class="tooltip-row">
      <span class="tooltip-key">${data.colLabels.v1}</span>
      <span class="tooltip-val">${fmt(v1)}</span>
    </div>
    <div class="tooltip-row">
      <span class="tooltip-key">${data.colLabels.v2}</span>
      <span class="tooltip-val">${fmt(v2)}</span>
    </div>
    ${diff !== null ? `
    <div class="tooltip-change ${diffClass}">
      ${diff > 0 ? '▲' : diff < 0 ? '▼' : '—'} ${sign}${Math.abs(diff).toFixed(1)}
    </div>` : ''}
    <span class="tooltip-status ${classStatusCSS(cat)}">${classLabel(cat)}</span>
  `;

  positionTooltip(mouseEvent);
  dom.tooltip.classList.remove('hidden');
}

function positionTooltip(e) {
  const tt = dom.tooltip;
  let x = e.clientX + 16;
  let y = e.clientY + 16;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (x + 240 > vw) x = e.clientX - 240 - 8;
  if (y + 200 > vh) y = e.clientY - 200 - 8;

  tt.style.left = x + 'px';
  tt.style.top  = y + 'px';
}

function hideTooltip() {
  dom.tooltip.classList.add('hidden');

  // Reset style on all layers
  if (state.layerLeft)  state.layerLeft.resetStyle();
  if (state.layerRight) state.layerRight.resetStyle();
}

/* ══════════════════════════════════════════════════════ CLICK → SIDEBAR INFO */

function onFeatureClick(e, feature) {
  const data  = state.indicatorData;
  const id    = getFeatureId(feature);
  const name  = getFeatureName(feature) || id;
  const props = feature.properties;
  const entry = (state.level === 'municipal' ? data.mun : data.dep).get(id);

  state.selectedId = id;

  const v1  = entry?.v1;
  const v2  = entry?.v2;
  const cat = classify(v2 ?? v1, data.thresholds);
  const fmt = v => v !== null && v !== undefined ? v.toFixed(1) : '—';
  const diff = (v1 !== null && v2 !== null) ? (v2 - v1).toFixed(1) : null;

  const dpto2 = props.DEPARTAMEN || props.departamen || '';
  const prov2 = props.PROVINCIA  || props.provincia  || '';
  const cod2  = props.COD || props.cod || id;

  dom.munInfoCard.innerHTML = `
    <div class="mun-card-name">${name}</div>
    ${dpto2 ? `<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">${dpto2}${prov2 ? ' · ' + prov2 : ''}</div>` : ''}
    <div class="mun-card-row">
      <span class="mun-card-key">Código INE</span>
      <span class="mun-card-val">${cod2}</span>
    </div>
    <div class="mun-card-row">
      <span class="mun-card-key">${data.colLabels.v1}</span>
      <span class="mun-card-val">${fmt(v1)}</span>
    </div>
    <div class="mun-card-row">
      <span class="mun-card-key">${data.colLabels.v2}</span>
      <span class="mun-card-val">${fmt(v2)}</span>
    </div>
    ${diff !== null ? `<div class="mun-card-row">
      <span class="mun-card-key">Cambio</span>
      <span class="mun-card-val" style="color:${parseFloat(diff) >= 0 ? 'var(--c-meta)' : 'var(--c-grandes)'}">
        ${parseFloat(diff) > 0 ? '+' : ''}${diff}
      </span>
    </div>` : ''}
    <span class="mun-card-status ${classStatusCSS(cat)}">${classLabel(cat)}</span>
  `;

  dom.munInfoSection.style.display = 'block';
}

/* ══════════════════════════════════════════════════════ LEGEND */

function renderLegend(data) {
  const container = dom.legendContainer;
  const mun       = state.level === 'municipal' ? data.mun : data.dep;

  // Count per category
  const counts = { meta: 0, proximo: 0, retos: 0, grandes: 0, sin: 0 };
  for (const [, entry] of mun) {
    const val = entry.v2 ?? entry.v1;
    const cat = classify(val, data.thresholds);
    counts[cat]++;
  }

  const items = [
    { cat: 'meta',    label: 'Meta alcanzada',        color: ODS_COLORS.meta },
    { cat: 'proximo', label: 'Próximo a alcanzarse',   color: ODS_COLORS.proximo },
    { cat: 'retos',   label: 'Quedan retos importantes', color: ODS_COLORS.retos },
    { cat: 'grandes', label: 'Quedan retos grandes',   color: ODS_COLORS.grandes },
    { cat: 'sin',     label: 'Sin información',         color: ODS_COLORS.sin },
  ];

  container.innerHTML = '';
  for (const item of items) {
    const div = document.createElement('div');
    div.className = 'legend-item';
    div.innerHTML = `
      <div class="legend-dot" style="background:${item.color}"></div>
      <span class="legend-text">${item.label}</span>
      <span class="legend-count">${counts[item.cat]}</span>
    `;
    container.appendChild(div);
  }
}

/* ══════════════════════════════════════════════════════ STATS */

function renderStats(data) {
  const mun = state.level === 'municipal' ? data.mun : data.dep;
  const values2 = [];
  let withData = 0;

  for (const [, entry] of mun) {
    if (entry.v2 !== null) { values2.push(entry.v2); withData++; }
  }

  if (values2.length === 0) {
    dom.statsSection.style.display = 'none';
    return;
  }

  const avg = values2.reduce((a, b) => a + b, 0) / values2.length;
  const max = Math.max(...values2);
  const min = Math.min(...values2);

  dom.statsContainer.innerHTML = `
    <div class="stat-card"><div class="stat-value">${avg.toFixed(1)}</div><div class="stat-label">Promedio</div></div>
    <div class="stat-card"><div class="stat-value">${max.toFixed(1)}</div><div class="stat-label">Máximo</div></div>
    <div class="stat-card"><div class="stat-value">${min.toFixed(1)}</div><div class="stat-label">Mínimo</div></div>
    <div class="stat-card"><div class="stat-value">${withData}</div><div class="stat-label">Con datos</div></div>
  `;
  dom.statsSection.style.display = 'block';
}

/* ══════════════════════════════════════════════════════ SEARCH */

function initSearch() {
  dom.munSearch.addEventListener('input', () => {
    const q = dom.munSearch.value.trim().toLowerCase();
    if (!q || !state.indicatorData) {
      dom.searchResults.classList.add('hidden');
      return;
    }

    const results = [];
    const source  = state.level === 'municipal' ? state.indicatorData.mun : state.indicatorData.dep;

    for (const [id, entry] of source) {
      if (entry.name.toLowerCase().includes(q)) {
        results.push({ id, name: entry.name, v2: entry.v2 });
        if (results.length >= 8) break;
      }
    }

    if (results.length === 0) {
      dom.searchResults.classList.add('hidden');
      return;
    }

    dom.searchResults.innerHTML = '';
    for (const r of results) {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      const cat = classify(r.v2, state.indicatorData.thresholds);
      item.innerHTML = `
        <strong>${r.name}</strong>
        <br><span>${r.v2 !== null ? r.v2.toFixed(1) : '—'} · ${classLabel(cat)}</span>
      `;
      item.addEventListener('click', () => {
        zoomToMunicipality(r.id);
        dom.munSearch.value = r.name;
        dom.searchResults.classList.add('hidden');
      });
      dom.searchResults.appendChild(item);
    }

    dom.searchResults.classList.remove('hidden');
  });

  // Close search on outside click
  document.addEventListener('click', e => {
    if (!dom.munSearch.contains(e.target)) {
      dom.searchResults.classList.add('hidden');
    }
  });
}

function zoomToMunicipality(id) {
  if (!state.geoMun && !state.geoDep) return;
  const geo = state.level === 'municipal' ? state.geoMun : state.geoDep;
  if (!geo) return;

  for (const feature of geo.features) {
    const fid = getFeatureId(feature);
    if (fid === String(id)) {
      const bounds = L.geoJSON(feature).getBounds();
      mapLeft.fitBounds(bounds, { padding: [40, 40] });
      break;
    }
  }
}

/* ══════════════════════════════════════════════════════ COLUMN LABELS */

function updateColumnLabels(data) {
  if (!data) return;
  dom.colLabelLeft.textContent  = data.colLabels.v1;
  dom.colLabelRight.textContent = data.colLabels.v2;
}

/* ══════════════════════════════════════════════════════ DEMO PLACEHOLDER */
/**
 * Muestra un aviso visual cuando los archivos GeoJSON no están disponibles.
 * Útil durante desarrollo sin los archivos reales.
 */
function renderDemoPlaceholder() {
  const msgHTML = `
    <div style="
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 12px; padding: 24px; text-align: center;
      background: #f4f5f7;
      font-family: 'Sora', sans-serif;
    ">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
      </svg>
      <p style="color:#6b7280; font-size:13px; line-height:1.6; max-width:260px;">
        Agrega los archivos <strong>municipios.geojson</strong> y <strong>departamentos.geojson</strong>
        en <code style="background:#e5e7eb;padding:1px 4px;border-radius:3px">data/geojson/</code>
        para visualizar los mapas.
      </p>
    </div>
  `;

  document.getElementById('map-left').innerHTML  = msgHTML;
  document.getElementById('map-right').innerHTML = msgHTML;
}

/* ══════════════════════════════════════════════════════ EXPORT PNG */
function exportPNG() {
  // Simple approach: open print dialog for the current view
  // Para una exportación real de canvas, se requeriría leaflet-image o html2canvas
  alert('Para exportar: usa Ctrl+P y selecciona "Guardar como PDF", o instala html2canvas en el proyecto.');
}

/* ══════════════════════════════════════════════════════ FULLSCREEN */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

/* ══════════════════════════════════════════════════════ LOADING */
function setLoading(visible, text = '') {
  dom.loadingText.textContent = text;
  dom.loadingOverlay.classList.toggle('hidden', !visible);
}

/* ══════════════════════════════════════════════════════ MAIN FLOW */

async function onIndicatorChange(file) {
  if (!file) return;

  state.currentFile = file;
  dom.munInfoSection.style.display = 'none';

  const data = await readExcel(file);
  if (!data) return;

  state.indicatorData = data;

  updateColumnLabels(data);
  renderLegend(data);
  renderStats(data);
  renderMaps();
}

function onLevelChange(level) {
  state.level = level;

  dom.btnMunicipal.classList.toggle('active', level === 'municipal');
  dom.btnDep.classList.toggle('active',       level === 'departamental');

  if (state.indicatorData) {
    renderLegend(state.indicatorData);
    renderStats(state.indicatorData);
    renderMaps();
  }
}

/* ══════════════════════════════════════════════════════ BOOTSTRAP */

async function init() {
  setLoading(true, 'Iniciando atlas…');

  initMaps();
  await loadGeoJSON();
  await loadAvailableIndicators();
  initSearch();

  // Event listeners
  dom.indicatorSelect.addEventListener('change', e => onIndicatorChange(e.target.value));
  dom.btnMunicipal.addEventListener('click', () => onLevelChange('municipal'));
  dom.btnDep.addEventListener('click', () => {
    alert('El nivel departamental no está disponible. Agrega departamentos.geojson para activarlo.');
  });
  dom.btnExport.addEventListener('click',    exportPNG);
  dom.btnFullscreen.addEventListener('click', toggleFullscreen);

  // Mouse move for tooltip repositioning
  document.addEventListener('mousemove', e => {
    if (!dom.tooltip.classList.contains('hidden')) {
      positionTooltip(e);
    }
  });

  setLoading(false);

  // Auto-select first indicator if available
  if (INDICATOR_FILES.length > 0) {
    dom.indicatorSelect.value = INDICATOR_FILES[0].file;
    dom.indicatorSelect.dispatchEvent(new Event('change'));
  }
}

// Start when DOM ready
document.addEventListener('DOMContentLoaded', init);
