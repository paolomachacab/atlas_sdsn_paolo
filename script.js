/**
 * ═══════════════════════════════════════════════════════════════
 *  ATLAS TERRITORIAL BOLIVIA · script.js  v7
 * ═══════════════════════════════════════════════════════════════
 */
'use strict';

/* ══════ NAVIGATION ══════ */
function enterAtlas() {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('atlas-app').classList.remove('hidden');
}

function showView(view) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-btn[onclick="showView('${view}')"]`).classList.add('active');
  document.getElementById('view-maps').classList.toggle('hidden', view !== 'maps');
  document.getElementById('view-table').classList.toggle('hidden', view !== 'table');
  if (view === 'table' && state.indicatorData) renderTable(state.indicatorData);
}

/* ══════ LEGEND PERIOD ══════ */
let legendPeriod = 'v2';

function setLegendPeriod(period) {
  legendPeriod = period;
  document.getElementById('leg-btn-p1').classList.toggle('active', period === 'v1');
  document.getElementById('leg-btn-p2').classList.toggle('active', period === 'v2');
  if (state.indicatorData) renderLegend(state.indicatorData);
}

const INDICATOR_FILES = [
  { file: '01_04_01_03_nbi.xlsx', label: 'Necesidades básicas insatisfechas' },
  { file: '01_04_01_04_psv.xlsx', label: '% de Personas sin vivienda' },
  { file: '02_02_02_01_smu.xlsx', label: 'Obesidad en mujeres (15-49 años)' },
  { file: '02_02_02_02_dcn.xlsx', label: 'Desnutrición crónica niños < 5 años' },
  { file: '02_02_02_03_osn.xlsx', label: 'Obesidad en niños < 5 años' },
  { file: '02_02_03_04_pam.xlsx', label: 'Prevalencia de anemia en mujeres (15-49 años)' },
  { file: '03_03_01_05_vih.xlsx', label: 'Incidencia de VIH' },
  { file: '03_03_02_06_tub.xlsx', label: 'Incidencia de tuberculosis' },
  { file: '03_03_03_07_mal.xlsx', label: 'Incidencia de malaria' },
  { file: '03_03_05_08_tic.xlsx', label: 'Tasa infestación chagas' },
  { file: '03_03_05_09_tid.xlsx', label: 'Incidencia de dengue' },
  { file: '03_12_01_14_ppv.xlsx', label: 'Cobertura promedio de vacunas en menores de 1 año' },
  { file: '04_01_02_01_ash.xlsx', label: 'Tasa abandono secundaria hombres' },
  { file: '04_01_02_02_asm.xlsx', label: 'Tasa abandono secundaria mujeres' },
  { file: '04_03_04_04_pes.xlsx', label: 'Población con educación superior >19 años' },
  { file: '04_06_01_06_alf.xlsx', label: 'Tasa de alfabetización >15 años' },
  { file: '04_10_01_09_pcs.xlsx', label: 'Profesores calificados en nivel secundario' },
  { file: '04_02_02_03_pfp.xlsx', label: 'Porcentaje de niños de 4 a 5 años que asisten a algún establecimiento preescolar' },
  { file: '05_01_01_01_pga.xlsx', label: 'Paridad de género en abandono escolar en secundaria' },
  { file: '05_01_01_04_pgp.xlsx', label: 'Paridad de género en la tasa global de participación' },
  { file: '05_07_02_06_ttm.xlsx', label: 'Derechos de la mujer a propiedad/control de tierras' },
  { file: '06_01_01_01_cap.xlsx', label: 'Cobertura de agua potable' },
  { file: '06_02_01_02_cas.xlsx', label: 'Cobertura de saneamiento' },
  { file: '06_03_01_03_tar.xlsx', label: 'Tratamiento de aguas residuales' },
  { file: '07_01_01_02_cae.xlsx', label: 'Cobertura de energía eléctrica' },
  { file: '07_01_02_03_elc.xlsx', label: 'Energía limpia para cocinar' },
  { file: '08_05_02_02_tgh.xlsx', label: 'Tasa global de participación hombres >=10 años' },
  { file: '08_05_02_03_tgm.xlsx', label: 'Tasa global de participación mujeres >=10 años' },
  { file: '08_10_02_07_dsb.xlsx', label: 'Densidad de sucursales bancarias (acceso a servicios financieros)' },
  { file: '09_08_01_06_tfc.xlsx', label: 'Cobertura de telefonía fija o celular' },
  { file: '09_01_01_01_vpc.xlsx', label: 'Cantidad de vias fundamentales que pasan dentro de un municipio' },
  { file: '09_08_01_05_drb.xlsx', label: 'Densidad de radio bases' },
  { file: '09_08_01_01_ci.xlsx', label: 'Cobertura de hogares con internet' },
  { file: '10_02_01_02_esp.xlsx', label: 'Población que no habla español' },
  { file: '10_04_02_04_gin.xlsx', label: 'Coeficiente de Gini de años de educación' },
  { file: '11_01_01_02_ssb.xlsx', label: 'Hogares sin servicio sanitario o baño' },
  { file: '11_02_01_04_atc.xlsx', label: 'Asientos disponibles en transporte colectivo' },
  { file: '11_01_01_01_thm.xlsx', label: 'Tasa de hacinamiento' },
  { file: '11_06_02_05_ica.xlsx', label: 'Concentración media anual de PM2.5' },
  { file: '11_01_01_03_ava.xlsx', label: 'Porcentaje de viviendas adecuadas' },
  { file: '12_04_01_01_ipr.xlsx', label: 'Inversión pública municipal en residuos sólidos per cápita' },
  { file: '12_04_02_02_srr.xlsx', label: 'Porcentaje de población con recolección de residuos' },
  { file: '13_01_01_03_fec.xlsx', label: 'Porcentaje de familias afectadas por eventos climáticos' },
  { file: '15_01_02_01_sap.xlsx', label: 'Porcentaje de superficie en áreas protegidas' },
  { file: '15_02_01_04_tpd.xlsx', label: 'Tasa promedio de deforestación' },
  { file: '15_02_01_05_tpb.xlsx', label: 'Tasa promedio de pérdida de bosque' },
  { file: '15_05_02_02_pbd.xlsx', label: 'Índice de pérdida de biodiversidad por deforestación' },
  { file: '15_05_02_03_pbi.xlsx', label: 'Índice de pérdida de biodiversidad por incendios y minería' },
  { file: '16_06_01_02_cep.xlsx', label: 'Capacidad de ejecución del presupuesto programado' },
  { file: '16_09_01_04_nic.xlsx', label: 'Niños inscritos en registro civil' },
  { file: '16_01_01_01_thp.xlsx', label: 'Tasa de homicidios promedio 2017-2019 y 2022-2024' },
  { file: '16_07_02_03_tcs.xlsx', label: 'Bloqueos y manifestaciones' },
  { file: '17_18_01_02_ipc.xlsx', label: 'Inversión pública per cápita' },
  { file: '04_10_01_09_pci.xlsx', label: 'Profesores calificados en nivel inicial' },
];

const DATA_PATH   = 'data/indicadores/';
const GEOJSON_MUN = 'data/geojson/municipios.geojson';

const FIELD_CANDIDATES = {
  id:   ['COD','cod','COD_MUN','cod_mun','CODMUN','codmun','INE','ine','CODIGO','codigo','ID','id','OBJECTID','GID'],
  name: ['MUNICIPIO','municipio','NOM_MUN','nom_mun','NOMBRE','nombre','DEP_MUN_TI','NAME','name','NOM','nom'],
};

function detectFields(geojson) {
  if (!geojson?.features?.length) return { idField:'id', nameField:'name' };
  const props = geojson.features[0].properties;
  const keys  = Object.keys(props);
  const idField   = FIELD_CANDIDATES.id.find(c => keys.includes(c))   || keys[0];
  const nameField = FIELD_CANDIDATES.name.find(c => keys.includes(c)) || keys[1] || keys[0];
  console.log(`[Atlas] Campos detectados → id: "${idField}", nombre: "${nameField}"`);
  return { idField, nameField };
}

let GEO_FIELDS = { idField:'id', nameField:'name' };
const BOLIVIA_BOUNDS = [[-23.0,-69.7],[-9.6,-57.4]];
const ODS_COLORS = { meta:'#16a34a', proximo:'#ca8a04', retos:'#ea580c', grandes:'#dc2626', sin:'#d1d5db' };

const state = {
  level:'municipal', currentFile:null, indicatorData:null,
  geoMun:null, geoDep:null, layerLeft:null, layerRight:null,
  selectedId:null, isSyncing:false,
};

const $ = id => document.getElementById(id);
const dom = {
  get indicatorSelect() { return $('indicator-select'); },
  get munSearch()       { return $('municipality-search'); },
  get searchResults()   { return $('search-results'); },
  get legendContainer() { return $('legend-container'); },
  get statsSection()    { return $('stats-section'); },
  get statsContainer()  { return $('stats-container'); },
  get munInfoSection()  { return $('mun-info-section'); },
  get munInfoCard()     { return $('mun-info-card'); },
  get loadingOverlay()  { return $('loading-overlay'); },
  get loadingText()     { return $('loading-text'); },
  get tooltip()         { return $('map-tooltip'); },
  get colLabelLeft()    { return $('col-label-left'); },
  get colLabelRight()   { return $('col-label-right'); },
  get btnMunicipal()    { return $('btn-municipal'); },
  get btnDep()          { return $('btn-departamental'); },
  get btnExport()       { return $('btn-export'); },
  get btnFullscreen()   { return $('btn-fullscreen'); },
  get analysisPanel()   { return $('analysis-panel'); },
};

let mapLeft, mapRight;

function initMaps() {
  const tileUrl  = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
  const tileOpts = { attribution:'©OSM ©Carto', subdomains:'abcd', maxZoom:19 };
  const bounds   = L.latLngBounds(BOLIVIA_BOUNDS[0], BOLIVIA_BOUNDS[1]);

  mapLeft  = L.map('map-left',  { zoomControl:true,  attributionControl:false, maxBounds:bounds.pad(0.3) }).fitBounds(bounds);
  mapRight = L.map('map-right', { zoomControl:false, attributionControl:false, maxBounds:bounds.pad(0.3) }).fitBounds(bounds);

  L.tileLayer(tileUrl, tileOpts).addTo(mapLeft);
  L.tileLayer(tileUrl, tileOpts).addTo(mapRight);

  mapLeft.on('move',  () => syncMap(mapLeft,  mapRight));
  mapRight.on('move', () => syncMap(mapRight, mapLeft));
}

function syncMap(source, target) {
  if (state.isSyncing) return;
  state.isSyncing = true;
  target.setView(source.getCenter(), source.getZoom(), { animate:false });
  state.isSyncing = false;
}

async function loadGeoJSON() {
  setLoading(true, 'Cargando geometrías territoriales…');
  try {
    const res = await fetch(GEOJSON_MUN + '?v=' + Date.now());
    if (res.ok) {
      const text = await res.text();
      try {
        state.geoMun = JSON.parse(text);
        GEO_FIELDS   = detectFields(state.geoMun);
        console.log('[Atlas] GeoJSON OK:', state.geoMun.features.length, 'features');
      } catch(e) {
        console.error('[Atlas] JSON parse error:', e.message);
        state.geoMun = null;
      }
    }
  } catch(e) { state.geoMun = null; }
  state.geoDep = null;
  setLoading(false);
}

async function loadAvailableIndicators() {
  dom.indicatorSelect.innerHTML = '<option value="">— Seleccionar indicador —</option>';
  const ODS_NAMES = {
    '01': 'ODS 1 - Fin de la pobreza',
    '02': 'ODS 2 - Hambre cero',
    '03': 'ODS 3 - Salud y bienestar',
    '04': 'ODS 4 - Educacion de calidad',
    '05': 'ODS 5 - Igualdad de genero',
    '06': 'ODS 6 - Agua limpia y saneamiento',
    '07': 'ODS 7 - Energia asequible',
    '08': 'ODS 8 - Trabajo decente',
    '09': 'ODS 9 - Industria e innovacion',
    '10': 'ODS 10 - Reduccion de desigualdades',
    '11': 'ODS 11 - Ciudades sostenibles',
    '12': 'ODS 12 - Produccion responsable',
    '13': 'ODS 13 - Accion por el clima',
    '15': 'ODS 15 - Ecosistemas terrestres',
    '16': 'ODS 16 - Paz y justicia',
    '17': 'ODS 17 - Alianzas',
  };
  const groups = {};
  for (const ind of INDICATOR_FILES) {
    const ods = ind.file.split('_')[0];
    if (!groups[ods]) groups[ods] = [];
    groups[ods].push(ind);
  }
  for (const ods of Object.keys(groups).sort()) {
    const grp = document.createElement('optgroup');
    grp.label = ODS_NAMES[ods] || ('ODS ' + parseInt(ods));
    for (const ind of groups[ods]) {
      const opt = document.createElement('option');
      opt.value = ind.file;
      opt.textContent = ind.label;
      grp.appendChild(opt);
    }
    dom.indicatorSelect.appendChild(grp);
  }
}

async function readExcel(filename) {
  setLoading(true, `Leyendo datos: ${filename}…`);
  const url = DATA_PATH + filename;
  let workbook;
  try {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    workbook  = XLSX.read(buf, { type:'array' });
  } catch(e) {
    console.error('Error cargando Excel:', e);
    setLoading(false);
    return null;
  }

  const result = { mun:new Map(), dep:new Map(), thresholds:null, colLabels:{ v1:'2012', v2:'2024' }, indicatorName:'', indicatorCode:'' };
  // Extract code from filename
  result.indicatorCode = filename.replace('.xlsx','');

  if (workbook.SheetNames.includes('Indicador_MUN')) {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets['Indicador_MUN'], { header:1 });
    if (rows.length > 1) {
      result.colLabels.v1 = rows[0][2] || '2012';
      result.colLabels.v2 = rows[0][3] || '2024';
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row[0]) continue;
        const id = String(Math.round(Number(row[0])) || row[0]).trim();
        const v1 = parseFloat(row[2]);
        const v2 = parseFloat(row[3]);
        result.mun.set(id, { name: row[1]||id, v1: isNaN(v1)?null:v1, v2: isNaN(v2)?null:v2 });
      }
    }
  }

  if (workbook.SheetNames.includes('Indicador_DEP')) {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets['Indicador_DEP'], { header:1 });
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0]) continue;
      result.dep.set(String(row[0]).trim(), { name:row[1]||String(row[0]), v1:parseFloat(row[2])||null, v2:parseFloat(row[3])||null });
    }
  }

  if (workbook.SheetNames.includes('Umbral')) {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets['Umbral'], { header:1 });
    if (rows.length > 1) {
      const r = rows[1];
      result.indicatorName = r[1] || '';  // Column B = indicator full name
      result.thresholds = {
        meta:    { max:parseFloat(r[2]), min:parseFloat(r[3]) },
        proximo: { max:parseFloat(r[4]), min:parseFloat(r[5]) },
        retos:   { max:parseFloat(r[6]), min:parseFloat(r[7]) },
        grandes: { max:parseFloat(r[8]), min:parseFloat(r[9]) },
      };
    }
  }

  setLoading(false);
  return result;
}

function classify(value, thresholds) {
  if (value === null || value === undefined || isNaN(value)) return 'sin';
  if (!thresholds) return 'sin';
  const t = thresholds;
  const ascending = t.meta.max >= t.meta.min;
  if (ascending) {
    if (value >= t.meta.min)    return 'meta';
    if (value >= t.proximo.min) return 'proximo';
    if (value >= t.retos.min)   return 'retos';
    return 'grandes';
  } else {
    if (value <= t.meta.max)    return 'meta';
    if (value <= t.proximo.max) return 'proximo';
    if (value <= t.retos.max)   return 'retos';
    return 'grandes';
  }
}

function classLabel(cat) {
  return { meta:'Meta alcanzada', proximo:'Próximo a alcanzarse', retos:'Quedan retos importantes', grandes:'Quedan retos grandes', sin:'Sin información' }[cat] || 'Sin información';
}

function classStatusCSS(cat) {
  return `status-${cat}`;
}

function getFeatureId(feature) {
  const p = feature.properties;
  const raw = p[GEO_FIELDS.idField] ?? p.COD_MUN ?? p.cod_mun ?? p.ID ?? p.id ?? p.OBJECTID ?? '';
  return String(Math.round(Number(raw)) || raw).trim();
}

function getFeatureName(feature) {
  const p = feature.properties;
  return String(p[GEO_FIELDS.nameField] ?? p.MUNICIPIO ?? p.municipio ?? p.NAME ?? p.name ?? '').trim();
}

let _styleDebugCount = 0;

function featureStyle(feature, period, data, thresholds) {
  const id    = getFeatureId(feature);
  const entry = data.get(id);
  const val   = entry ? (period === 'left' ? entry.v1 : entry.v2) : null;
  const cat   = classify(val, thresholds);
  if (_styleDebugCount < 3 && period === 'left') {
    console.log(`[Style] id="${id}" val=${val} cat=${cat}`);
    _styleDebugCount++;
  }
  return { fillColor:ODS_COLORS[cat], fillOpacity:0.85, color:'#ffffff', weight:0.5, opacity:1 };
}

function renderMaps() {
  _styleDebugCount = 0;
  const data     = state.indicatorData;
  const mapData  = state.level === 'municipal' ? data.mun : data.dep;
  const geo      = state.level === 'municipal' ? state.geoMun : state.geoDep;

  if (!geo) { renderDemoPlaceholder(); return; }

  if (state.layerLeft)  mapLeft.removeLayer(state.layerLeft);
  if (state.layerRight) mapRight.removeLayer(state.layerRight);

  function makeLayer(map, period) {
    return L.geoJSON(geo, {
      style: f => featureStyle(f, period, mapData, data.thresholds),
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

  try {
    const bounds = state.layerLeft.getBounds();
    if (bounds.isValid()) {
      mapLeft.fitBounds(bounds,  { padding:[20,20], animate:false });
      mapRight.fitBounds(bounds, { padding:[20,20], animate:false });
    }
  } catch(e) {
    const b = L.latLngBounds(BOLIVIA_BOUNDS[0], BOLIVIA_BOUNDS[1]);
    mapLeft.fitBounds(b,  { padding:[20,20], animate:false });
    mapRight.fitBounds(b, { padding:[20,20], animate:false });
  }
}

function onFeatureHover(e, feature, period) {
  e.target.setStyle({ weight:2, color:'#1d4ed8', fillOpacity:0.95 });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) e.target.bringToFront();
  showTooltip(e.originalEvent, feature);
}

function showTooltip(mouseEvent, feature) {
  const data  = state.indicatorData;
  const id    = getFeatureId(feature);
  const name  = getFeatureName(feature) || id;
  const props = feature.properties;
  const entry = (state.level === 'municipal' ? data.mun : data.dep).get(id);
  const v1    = entry?.v1, v2 = entry?.v2;
  const cat   = classify(v2 ?? v1, data.thresholds);
  const fmt   = v => v !== null && v !== undefined ? v.toFixed(2) : '—';
  const diff  = (v1 !== null && v2 !== null) ? (v2 - v1) : null;
  const sign  = diff !== null ? (diff > 0 ? '+' : '') : '';
  const dClass = diff === null ? 'neutral' : diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral';
  const dpto  = props.DEPARTAMEN || '';
  const prov  = props.PROVINCIA  || '';
  const loc   = [dpto, prov].filter(Boolean).join(' · ');

  dom.tooltip.innerHTML = `
    <div class="tooltip-name">${name}</div>
    ${loc ? `<div style="font-size:11px;color:var(--text-light);margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid var(--border)">${loc}</div>` : ''}
    <div class="tooltip-row"><span class="tooltip-key">${data.colLabels.v1}</span><span class="tooltip-val">${fmt(v1)}</span></div>
    <div class="tooltip-row"><span class="tooltip-key">${data.colLabels.v2}</span><span class="tooltip-val">${fmt(v2)}</span></div>
    ${diff !== null ? `<div class="tooltip-change ${dClass}">${diff > 0 ? '▲' : diff < 0 ? '▼' : '—'} ${sign}${Math.abs(diff).toFixed(2)}</div>` : ''}
    <span class="tooltip-status ${classStatusCSS(cat)}">${classLabel(cat)}</span>
  `;
  positionTooltip(mouseEvent);
  dom.tooltip.classList.remove('hidden');
}

function positionTooltip(e) {
  let x = e.clientX + 16, y = e.clientY + 16;
  if (x + 240 > window.innerWidth)  x = e.clientX - 240 - 8;
  if (y + 200 > window.innerHeight) y = e.clientY - 200 - 8;
  dom.tooltip.style.left = x + 'px';
  dom.tooltip.style.top  = y + 'px';
}

function hideTooltip() {
  dom.tooltip.classList.add('hidden');
  if (state.layerLeft)  state.layerLeft.resetStyle();
  if (state.layerRight) state.layerRight.resetStyle();
}

function onFeatureClick(e, feature) {
  const data  = state.indicatorData;
  const id    = getFeatureId(feature);
  const name  = getFeatureName(feature) || id;
  const props = feature.properties;
  const entry = (state.level === 'municipal' ? data.mun : data.dep).get(id);
  state.selectedId = id;
  const v1 = entry?.v1, v2 = entry?.v2;
  const cat = classify(v2 ?? v1, data.thresholds);
  const fmt = v => v !== null && v !== undefined ? v.toFixed(2) : '—';
  const diff = (v1 !== null && v2 !== null) ? (v2 - v1).toFixed(2) : null;

  dom.munInfoCard.innerHTML = `
    <div class="mun-card-name">${name}</div>
    ${props.DEPARTAMEN ? `<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">${props.DEPARTAMEN}${props.PROVINCIA ? ' · '+props.PROVINCIA : ''}</div>` : ''}
    <div class="mun-card-row"><span class="mun-card-key">Código INE</span><span class="mun-card-val">${props.COD || id}</span></div>
    <div class="mun-card-row"><span class="mun-card-key">${data.colLabels.v1}</span><span class="mun-card-val">${fmt(v1)}</span></div>
    <div class="mun-card-row"><span class="mun-card-key">${data.colLabels.v2}</span><span class="mun-card-val">${fmt(v2)}</span></div>
    ${diff !== null ? `<div class="mun-card-row"><span class="mun-card-key">Cambio</span><span class="mun-card-val" style="color:${parseFloat(diff)>=0?'var(--c-meta)':'var(--c-grandes)'}">${parseFloat(diff)>0?'+':''}${diff}</span></div>` : ''}
    <span class="mun-card-status ${classStatusCSS(cat)}">${classLabel(cat)}</span>
  `;
  dom.munInfoSection.style.display = 'block';
}

function renderLegend(data) {
  const mun = state.level === 'municipal' ? data.mun : data.dep;
  const counts = { meta:0, proximo:0, retos:0, grandes:0, sin:0 };
  for (const [,entry] of mun) {
    const val = legendPeriod === 'v1' ? (entry.v1 ?? entry.v2) : (entry.v2 ?? entry.v1);
    counts[classify(val, data.thresholds)]++;
  }

  dom.legendContainer.innerHTML = '';
  [
    { cat:'meta',    label:'Meta alcanzada',           color:ODS_COLORS.meta },
    { cat:'proximo', label:'Próximo a alcanzarse',      color:ODS_COLORS.proximo },
    { cat:'retos',   label:'Quedan retos importantes',  color:ODS_COLORS.retos },
    { cat:'grandes', label:'Quedan retos grandes',      color:ODS_COLORS.grandes },
    { cat:'sin',     label:'Sin información',           color:ODS_COLORS.sin },
  ].forEach(item => {
    const div = document.createElement('div');
    div.className = 'legend-item';
    div.innerHTML = `<div class="legend-dot" style="background:${item.color}"></div><span class="legend-text">${item.label}</span><span class="legend-count">${counts[item.cat]}</span>`;
    dom.legendContainer.appendChild(div);
  });
}

function renderStats(data) {
  const mun = state.level === 'municipal' ? data.mun : data.dep;
  const values2 = [];
  for (const [,entry] of mun) if (entry.v2 !== null) values2.push(entry.v2);
  if (!values2.length) { dom.statsSection.style.display='none'; return; }
  const avg = values2.reduce((a,b)=>a+b,0)/values2.length;
  dom.statsContainer.innerHTML = `
    <div class="stat-card"><div class="stat-value">${avg.toFixed(1)}</div><div class="stat-label">Promedio</div></div>
    <div class="stat-card"><div class="stat-value">${Math.max(...values2).toFixed(1)}</div><div class="stat-label">Máximo</div></div>
    <div class="stat-card"><div class="stat-value">${Math.min(...values2).toFixed(1)}</div><div class="stat-label">Mínimo</div></div>
    <div class="stat-card"><div class="stat-value">${values2.length}</div><div class="stat-label">Con datos</div></div>
  `;
  dom.statsSection.style.display = 'block';
}

/* ══════════════════════════════════════════════════════ ANALYSIS PANEL */
function renderAnalysisPanel(data) {
  const panel = dom.analysisPanel;
  if (!panel) return;

  const mun = data.mun;
  const t   = data.thresholds;
  const label2 = data.colLabels.v2;
  const label1 = data.colLabels.v1;

  // Build sorted arrays with valid v2 values
  const entries = [];
  for (const [id, entry] of mun) {
    if (entry.v2 !== null) entries.push({ id, ...entry });
  }

  if (!entries.length) { panel.style.display='none'; return; }

  // Determine sort direction: ascending = higher is better
  const ascending = t ? t.meta.max >= t.meta.min : true;

  // Sort: best first
  const sorted = [...entries].sort((a,b) => ascending ? b.v2 - a.v2 : a.v2 - b.v2);
  const best5  = sorted.slice(0, 5);
  const worst5 = sorted.slice(-5).reverse();

  // Thresholds display
  let thresholdHTML = '';
  if (t) {
    const rows = ascending ? [
      { label:'Meta alcanzada',          color:ODS_COLORS.meta,    range:`≥ ${t.meta.min}` },
      { label:'Próximo a alcanzarse',     color:ODS_COLORS.proximo, range:`${t.proximo.min} – ${t.meta.min}` },
      { label:'Quedan retos importantes', color:ODS_COLORS.retos,   range:`${t.retos.min} – ${t.proximo.min}` },
      { label:'Quedan retos grandes',     color:ODS_COLORS.grandes, range:`< ${t.retos.min}` },
    ] : [
      { label:'Meta alcanzada',          color:ODS_COLORS.meta,    range:`≤ ${t.meta.max}` },
      { label:'Próximo a alcanzarse',     color:ODS_COLORS.proximo, range:`${t.meta.max} – ${t.proximo.max}` },
      { label:'Quedan retos importantes', color:ODS_COLORS.retos,   range:`${t.proximo.max} – ${t.retos.max}` },
      { label:'Quedan retos grandes',     color:ODS_COLORS.grandes, range:`> ${t.retos.max}` },
    ];
    thresholdHTML = rows.map(r => `
      <div class="threshold-row">
        <div class="threshold-dot" style="background:${r.color}"></div>
        <span class="threshold-label">${r.label}</span>
        <span class="threshold-range">${r.range}</span>
      </div>`).join('');
  }

  function munRows(list, isBest) {
    return list.map((m, i) => {
      const cat = classify(m.v2, t);
      const diff = m.v1 !== null ? (m.v2 - m.v1) : null;
      const sign = diff !== null ? (diff > 0 ? '+' : '') : '';
      return `
      <div class="rank-row">
        <div class="rank-num" style="color:${isBest ? ODS_COLORS.meta : ODS_COLORS.grandes}">${i+1}</div>
        <div class="rank-info">
          <div class="rank-name">${m.name}</div>
          <div class="rank-sub">${diff !== null ? `Cambio: ${sign}${diff.toFixed(2)}` : ''}</div>
        </div>
        <div class="rank-value">
          <div style="font-family:'DM Mono',monospace;font-size:14px;font-weight:600">${m.v2.toFixed(2)}</div>
          <div class="rank-badge" style="background:${ODS_COLORS[cat]}20;color:${ODS_COLORS[cat]}">${classLabel(cat)}</div>
        </div>
      </div>`;
    }).join('');
  }

  panel.style.display = 'block';
  panel.innerHTML = `
    <div class="analysis-grid">

      <div class="analysis-card">
        <div class="analysis-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          Umbrales ODS · ${label2}
        </div>
        <div class="threshold-list">${thresholdHTML}</div>
      </div>

      <div class="analysis-card">
        <div class="analysis-card-title" style="color:var(--c-meta)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          5 Mejores municipios · ${label2}
        </div>
        <div class="rank-list">${munRows(best5, true)}</div>
      </div>

      <div class="analysis-card">
        <div class="analysis-card-title" style="color:var(--c-grandes)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
          5 Municipios con más retos · ${label2}
        </div>
        <div class="rank-list">${munRows(worst5, false)}</div>
      </div>

    </div>
  `;
}

function initSearch() {
  dom.munSearch.addEventListener('input', () => {
    const q = dom.munSearch.value.trim().toLowerCase();
    if (!q || !state.indicatorData) { dom.searchResults.classList.add('hidden'); return; }
    const results = [];
    for (const [id, entry] of state.indicatorData.mun) {
      if (entry.name.toLowerCase().includes(q)) { results.push({ id, ...entry }); if (results.length >= 8) break; }
    }
    if (!results.length) { dom.searchResults.classList.add('hidden'); return; }
    dom.searchResults.innerHTML = '';
    for (const r of results) {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      const cat = classify(r.v2, state.indicatorData.thresholds);
      item.innerHTML = `<strong>${r.name}</strong><br><span>${r.v2 !== null ? r.v2.toFixed(2) : '—'} · ${classLabel(cat)}</span>`;
      item.addEventListener('click', () => { zoomToMunicipality(r.id); dom.munSearch.value = r.name; dom.searchResults.classList.add('hidden'); });
      dom.searchResults.appendChild(item);
    }
    dom.searchResults.classList.remove('hidden');
  });
  document.addEventListener('click', e => { if (!dom.munSearch.contains(e.target)) dom.searchResults.classList.add('hidden'); });
}

function zoomToMunicipality(id) {
  const geo = state.level === 'municipal' ? state.geoMun : state.geoDep;
  if (!geo) return;
  for (const feature of geo.features) {
    if (getFeatureId(feature) === String(id)) {
      mapLeft.fitBounds(L.geoJSON(feature).getBounds(), { padding:[40,40] });
      break;
    }
  }
}

function updateColumnLabels(data) {
  if (!data) return;
  dom.colLabelLeft.textContent  = data.colLabels.v1;
  dom.colLabelRight.textContent = data.colLabels.v2;

  // Update title bar
  const titleEl = document.getElementById('indicator-full-name');
  const codeEl  = document.getElementById('indicator-code');
  if (titleEl) titleEl.textContent = data.indicatorName || data.colLabels.v2;
  if (codeEl)  codeEl.textContent  = data.indicatorCode || '';

  // Update table header
  const th1 = document.getElementById('th-v1');
  const th2 = document.getElementById('th-v2');
  if (th1) th1.textContent = data.colLabels.v1;
  if (th2) th2.textContent = data.colLabels.v2;

  // Update table indicator name
  const tn = document.getElementById('table-indicator-name');
  if (tn) tn.textContent = data.indicatorName || '—';
}

function renderDemoPlaceholder() {
  const msg = `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center;background:#f4f5f7;font-family:'Sora',sans-serif"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg><p style="color:#6b7280;font-size:13px;line-height:1.6;max-width:260px">Agrega <strong>municipios.geojson</strong> en <code style="background:#e5e7eb;padding:1px 4px;border-radius:3px">data/geojson/</code></p></div>`;
  document.getElementById('map-left').innerHTML  = msg;
  document.getElementById('map-right').innerHTML = msg;
}

function exportPNG() { alert('Para exportar: usa Ctrl+P → Guardar como PDF.'); }
function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
  else document.exitFullscreen();
}
function setLoading(visible, text='') {
  dom.loadingText.textContent = text;
  dom.loadingOverlay.classList.toggle('hidden', !visible);
}

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
  try { renderAnalysisPanel(data); } catch(e) { console.warn('[Atlas] Panel análisis error:', e); }
}

function onLevelChange(level) {
  state.level = level;
  dom.btnMunicipal.classList.toggle('active', level === 'municipal');
  dom.btnDep.classList.toggle('active',       level === 'departamental');
  if (state.indicatorData) { renderLegend(state.indicatorData); renderStats(state.indicatorData); renderMaps(); }
}

/* ══════ TABLE VIEW ══════ */
let tableData = [];
let tableSortCol = 4;
let tableSortAsc = false;

function renderTable(data) {
  if (!data) return;
  const mun = data.mun;
  tableData = [];
  for (const [id, entry] of mun) {
    const cat = classify(entry.v2 ?? entry.v1, data.thresholds);
    const diff = (entry.v1 !== null && entry.v2 !== null) ? (entry.v2 - entry.v1) : null;
    tableData.push({ id, name: entry.name, v1: entry.v1, v2: entry.v2, diff, cat });
  }
  renderTableRows(data);

  // Sort on header click
  document.querySelectorAll('.data-table th').forEach((th, i) => {
    th.onclick = () => {
      if (tableSortCol === i) tableSortAsc = !tableSortAsc;
      else { tableSortCol = i; tableSortAsc = i < 3; }
      renderTableRows(data);
    };
  });

  // Filter
  const searchEl = document.getElementById('table-search');
  if (searchEl) {
    searchEl.oninput = () => renderTableRows(data);
  }

  // CSV download
  const csvBtn = document.getElementById('btn-download-csv');
  if (csvBtn) csvBtn.onclick = () => downloadCSV(data);
}

function renderTableRows(data) {
  const q = (document.getElementById('table-search')?.value || '').toLowerCase();
  let rows = tableData.filter(r => !q || r.name.toLowerCase().includes(q));

  rows.sort((a, b) => {
    let va, vb;
    if (tableSortCol === 0)      { va = a.id;   vb = b.id; }
    else if (tableSortCol === 1) { va = a.name; vb = b.name; }
    else if (tableSortCol === 3) { va = a.v1 ?? -Infinity; vb = b.v1 ?? -Infinity; }
    else if (tableSortCol === 4) { va = a.v2 ?? -Infinity; vb = b.v2 ?? -Infinity; }
    else if (tableSortCol === 5) { va = a.diff ?? -Infinity; vb = b.diff ?? -Infinity; }
    else                          { va = a.cat; vb = b.cat; }
    if (va < vb) return tableSortAsc ? -1 : 1;
    if (va > vb) return tableSortAsc ? 1 : -1;
    return 0;
  });

  const fmt = v => v !== null && v !== undefined ? v.toFixed(2) : '—';
  const tbody = document.getElementById('table-body');
  if (!tbody) return;

  tbody.innerHTML = rows.map(r => {
    const diffClass = r.diff === null ? '' : r.diff >= 0 ? 'td-positive' : 'td-negative';
    const diffStr   = r.diff !== null ? (r.diff >= 0 ? '+' : '') + r.diff.toFixed(2) : '—';
    return `<tr>
      <td>${r.id}</td>
      <td><strong>${r.name}</strong></td>
      <td>—</td>
      <td>${fmt(r.v1)}</td>
      <td>${fmt(r.v2)}</td>
      <td class="${diffClass}">${diffStr}</td>
      <td><span class="mun-card-status ${r.cat ? 'status-'+r.cat : ''}">${classLabel(r.cat)}</span></td>
    </tr>`;
  }).join('');
}

function downloadCSV(data) {
  const rows = [['Código','Municipio','Período inicial','Período final','Cambio','Clasificación']];
  for (const r of tableData) {
    rows.push([r.id, r.name, r.v1 ?? '', r.v2 ?? '', r.diff !== null ? r.diff.toFixed(2) : '', classLabel(r.cat)]);
  }
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = (data.indicatorCode || 'indicador') + '.csv';
  a.click();
}

async function init() {
  setLoading(true, 'Iniciando atlas…');
  initMaps();
  await loadGeoJSON();
  await loadAvailableIndicators();
  initSearch();

  dom.indicatorSelect.addEventListener('change', e => onIndicatorChange(e.target.value));
  dom.btnMunicipal.addEventListener('click', () => onLevelChange('municipal'));
  dom.btnDep.addEventListener('click', () => alert('Agrega departamentos.geojson para activar este nivel.'));
  dom.btnExport.addEventListener('click', exportPNG);
  dom.btnFullscreen.addEventListener('click', toggleFullscreen);
  document.addEventListener('mousemove', e => { if (!dom.tooltip.classList.contains('hidden')) positionTooltip(e); });

  setLoading(false);
  if (INDICATOR_FILES.length > 0) {
    dom.indicatorSelect.value = INDICATOR_FILES[0].file;
    dom.indicatorSelect.dispatchEvent(new Event('change'));
  }
}

document.addEventListener('DOMContentLoaded', init);
