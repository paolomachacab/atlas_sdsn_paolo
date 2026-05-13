/**
 * ═══════════════════════════════════════════════════════════════
 *  ATLAS TERRITORIAL BOLIVIA · script.js  v7
 * ═══════════════════════════════════════════════════════════════
 */
'use strict';

/* ══════ UMBRALES CENTRALIZADOS ══════ */
const ALL_THRESHOLDS = {
  '01_04_01_03_nbi': {
    meta:    { max: 0, min: 15 },
    proximo: { max: 15, min: 32.5 },
    retos:   { max: 32.5, min: 50 },
    grandes: { max: 50, min: 100 },
  },
  '01_04_01_04_psv': {
    meta:    { max: 0, min: 70 },
    proximo: { max: 70, min: 141 },
    retos:   { max: 141, min: 282 },
    grandes: { max: 282, min: 1185 },
  },
  '02_02_02_01_smu': {
    meta:    { max: 0, min: 15.6 },
    proximo: { max: 15.6, min: 22.05 },
    retos:   { max: 22.05, min: 28.5 },
    grandes: { max: 28.5, min: 100 },
  },
  '02_02_02_02_dcn': {
    meta:    { max: 0, min: 10 },
    proximo: { max: 10, min: 17.5 },
    retos:   { max: 17.5, min: 25 },
    grandes: { max: 25, min: 100 },
  },
  '02_02_02_03_osn': {
    meta:    { max: 0, min: 6.2 },
    proximo: { max: 6.2, min: 7.9 },
    retos:   { max: 7.9, min: 9.5 },
    grandes: { max: 9.5, min: 100 },
  },
  '02_02_03_04_pam': {
    meta:    { max: 0, min: 30.3 },
    proximo: { max: 30.3, min: 41.9 },
    retos:   { max: 41.9, min: 53.4 },
    grandes: { max: 53.4, min: 100 },
  },
  '03_03_01_05_vih': {
    meta:    { max: 0, min: 0 },
    proximo: { max: 0, min: 353.65 },
    retos:   { max: 353.65, min: 707.3 },
    grandes: { max: 707.3, min: 11516.4 },
  },
  '03_03_02_06_tub': {
    meta:    { max: 0, min: 16.7 },
    proximo: { max: 16.7, min: 36.7 },
    retos:   { max: 36.7, min: 56.8 },
    grandes: { max: 56.8, min: 433.4 },
  },
  '03_03_03_07_mal': {
    meta:    { max: 0, min: 1 },
    proximo: { max: 1, min: 10 },
    retos:   { max: 10, min: 50 },
    grandes: { max: 50, min: 165.7 },
  },
  '03_03_05_08_tic': {
    meta:    { max: 0, min: 0 },
    proximo: { max: 0, min: 0.7 },
    retos:   { max: 0.7, min: 1.9 },
    grandes: { max: 1.9, min: 26 },
  },
  '03_03_05_09_tid': {
    meta:    { max: 0, min: 0 },
    proximo: { max: 0, min: 2 },
    retos:   { max: 2, min: 4 },
    grandes: { max: 4, min: 190.2 },
  },
  '03_12_01_14_ppv': {
    meta:    { max: 100, min: 83.3506985188644 },
    proximo: { max: 83.3506985188644, min: 61.07378602593669 },
    retos:   { max: 61.07378602593669, min: 38.79687353300898 },
    grandes: { max: 38.79687353300898, min: 0 },
  },
  '04_01_02_01_ash': {
    meta:    { max: 0, min: 3 },
    proximo: { max: 3, min: 4.5 },
    retos:   { max: 4.5, min: 6 },
    grandes: { max: 6, min: 100 },
  },
  '04_01_02_02_asm': {
    meta:    { max: 0, min: 3 },
    proximo: { max: 3, min: 4.5 },
    retos:   { max: 4.5, min: 6 },
    grandes: { max: 6, min: 100 },
  },
  '04_02_02_03_pfp': {
    meta:    { max: 100, min: 53.9 },
    proximo: { max: 53.9, min: 43.8 },
    retos:   { max: 43.8, min: 33.8 },
    grandes: { max: 33.8, min: 0 },
  },
  '04_03_04_04_pes': {
    meta:    { max: 100, min: 17 },
    proximo: { max: 17, min: 10.5 },
    retos:   { max: 10.5, min: 4 },
    grandes: { max: 4, min: 0 },
  },
  '04_06_01_06_alf': {
    meta:    { max: 100, min: 95 },
    proximo: { max: 95, min: 90 },
    retos:   { max: 90, min: 85 },
    grandes: { max: 85, min: 0 },
  },
  '04_10_01_07_pci': {
    meta:    { max: 100, min: 96.9 },
    proximo: { max: 96.9, min: 69.6 },
    retos:   { max: 69.6, min: 42.3 },
    grandes: { max: 42.3, min: 0 },
  },
  '04_10_01_09_pcs': {
    meta:    { max: 100, min: 96.9 },
    proximo: { max: 96.9, min: 69.6 },
    retos:   { max: 69.6, min: 42.3 },
    grandes: { max: 42.3, min: 0 },
  },
  '05_01_01_01_pga': {
    meta:    { max: 1, min: 1 },
    proximo: { max: 1, min: 0.865 },
    retos:   { max: 0.865, min: 0.73 },
    grandes: { max: 0.73, min: 0 },
  },
  '05_01_01_04_pgp': {
    meta:    { max: 1, min: 0.8 },
    proximo: { max: 0.8, min: 0.7 },
    retos:   { max: 0.7, min: 0.5 },
    grandes: { max: 0.5, min: 0 },
  },
  '05_07_02_06_ttm': {
    meta:    { max: 100, min: 50 },
    proximo: { max: 50, min: 39.3 },
    retos:   { max: 39.3, min: 17.6 },
    grandes: { max: 17.6, min: 0 },
  },
  '06_01_01_01_cap': {
    meta:    { max: 100, min: 98 },
    proximo: { max: 98, min: 89 },
    retos:   { max: 89, min: 80 },
    grandes: { max: 80, min: 0 },
  },
  '06_02_01_02_cas': {
    meta:    { max: 100, min: 95 },
    proximo: { max: 95, min: 85 },
    retos:   { max: 85, min: 75 },
    grandes: { max: 75, min: 0 },
  },
  '06_03_01_03_tar': {
    meta:    { max: 100, min: 50 },
    proximo: { max: 50, min: 32.5 },
    retos:   { max: 32.5, min: 15 },
    grandes: { max: 15, min: 0 },
  },
  '07_01_01_02_cae': {
    meta:    { max: 100, min: 98 },
    proximo: { max: 98, min: 89 },
    retos:   { max: 89, min: 80 },
    grandes: { max: 80, min: 0 },
  },
  '07_01_02_03_elc': {
    meta:    { max: 100, min: 85 },
    proximo: { max: 85, min: 67.5 },
    retos:   { max: 67.5, min: 50 },
    grandes: { max: 50, min: 0 },
  },
  '08_05_02_02_tgh': {
    meta:    { max: 100, min: 85.8 },
    proximo: { max: 85.8, min: 80.2 },
    retos:   { max: 80.2, min: 74.5 },
    grandes: { max: 74.5, min: 0 },
  },
  '08_05_02_03_tgm': {
    meta:    { max: 100, min: 66.5 },
    proximo: { max: 66.5, min: 55.1 },
    retos:   { max: 55.1, min: 43.7 },
    grandes: { max: 43.7, min: 0 },
  },
  '08_10_02_07_dsb': {
    meta:    { max: 225, min: 17.8 },
    proximo: { max: 17.8, min: 9.5 },
    retos:   { max: 9.5, min: 1.2 },
    grandes: { max: 1.2, min: 0 },
  },
  '09_01_01_01_vpc': {
    meta:    { max: 5, min: 2 },
    proximo: { max: 2, min: 1 },
    retos:   { max: 1, min: 0 },
    grandes: { max: 0, min: 0 },
  },
  '09_08_01_01_ci': {
    meta:    { max: 100, min: 71.85 },
    proximo: { max: 71.85, min: 58.13 },
    retos:   { max: 58.13, min: 44.41833632466562 },
    grandes: { max: 44.41833632466562, min: 0 },
  },
  '09_08_01_05_drb': {
    meta:    { max: 3, min: 2.41 },
    proximo: { max: 2.41, min: 0.58 },
    retos:   { max: 0.58, min: 0.02 },
    grandes: { max: 0.02, min: 0 },
  },
  '09_08_01_06_tfc': {
    meta:    { max: 100, min: 75 },
    proximo: { max: 75, min: 57.5 },
    retos:   { max: 57.5, min: 40 },
    grandes: { max: 40, min: 0 },
  },
  '10_02_01_02_esp': {
    meta:    { max: 0, min: 1.2 },
    proximo: { max: 1.2, min: 15.1 },
    retos:   { max: 15.1, min: 29 },
    grandes: { max: 29, min: 100 },
  },
  '10_04_02_04_gin': {
    meta:    { max: 0, min: 0.31 },
    proximo: { max: 0.31, min: 0.4 },
    retos:   { max: 0.4, min: 0.48 },
    grandes: { max: 0.48, min: 1 },
  },
  '11_01_01_01_thm': {
    meta:    { max: 0, min: 15 },
    proximo: { max: 15, min: 22.5 },
    retos:   { max: 22.5, min: 30 },
    grandes: { max: 30, min: 100 },
  },
  '11_01_01_02_ssb': {
    meta:    { max: 0, min: 15 },
    proximo: { max: 15, min: 32.5 },
    retos:   { max: 32.5, min: 50 },
    grandes: { max: 50, min: 100 },
  },
  '11_01_01_03_ava': {
    meta:    { max: 100, min: 49 },
    proximo: { max: 49, min: 31 },
    retos:   { max: 31, min: 12 },
    grandes: { max: 12, min: 0 },
  },
  '11_02_01_04_atc': {
    meta:    { max: 5366.29, min: 93 },
    proximo: { max: 93, min: 49 },
    retos:   { max: 49, min: 5 },
    grandes: { max: 5, min: 0 },
  },
  '11_06_02_05_ica': {
    meta:    { max: 0, min: 10 },
    proximo: { max: 10, min: 15 },
    retos:   { max: 15, min: 25 },
    grandes: { max: 25, min: 31 },
  },
  '12_04_01_01_ipr': {
    meta:    { max: 999, min: 8.2 },
    proximo: { max: 8.2, min: 0.8 },
    retos:   { max: 0.8, min: 0 },
    grandes: { max: 0, min: 0 },
  },
  '12_04_02_02_srr': {
    meta:    { max: 100, min: 43.3 },
    proximo: { max: 43.3, min: 20.4 },
    retos:   { max: 20.4, min: 0 },
    grandes: { max: 0, min: 0 },
  },
  '13_01_01_03_fec': {
    meta:    { max: 0, min: 5 },
    proximo: { max: 5, min: 15 },
    retos:   { max: 15, min: 30 },
    grandes: { max: 30, min: 444 },
  },
  '15_01_02_01_sap': {
    meta:    { max: 100, min: 25 },
    proximo: { max: 25, min: 15 },
    retos:   { max: 15, min: 5 },
    grandes: { max: 5, min: 0 },
  },
  '15_02_01_04_tpd': {
    meta:    { max: 0, min: 0 },
    proximo: { max: 0, min: 0.955 },
    retos:   { max: 0.955, min: 1.91 },
    grandes: { max: 1.91, min: 100 },
  },
  '15_02_01_05_tpb': {
    meta:    { max: 0, min: 0 },
    proximo: { max: 0, min: 0.71 },
    retos:   { max: 0.71, min: 2.1 },
    grandes: { max: 2.1, min: 100 },
  },
  '15_05_02_02_pbd': {
    meta:    { max: 0, min: 0.06 },
    proximo: { max: 0.06, min: 0.17 },
    retos:   { max: 0.17, min: 0.3 },
    grandes: { max: 0.3, min: 4.32 },
  },
  '15_05_02_03_pbi': {
    meta:    { max: 0, min: 0.15 },
    proximo: { max: 0.15, min: 0.8 },
    retos:   { max: 0.8, min: 1.4 },
    grandes: { max: 1.4, min: 62 },
  },
  '16_01_01_01_thp': {
    meta:    { max: 0, min: 1.31 },
    proximo: { max: 1.31, min: 2.35 },
    retos:   { max: 2.35, min: 3.39 },
    grandes: { max: 3.39, min: 26.72 },
  },
  '16_06_01_02_cep': {
    meta:    { max: 95, min: 83.4 },
    proximo: { max: 83.4, min: 71.7 },
    retos:   { max: 71.7, min: 60 },
    grandes: { max: 60, min: 0 },
  },
  '16_07_02_03_tcs': {
    meta:    { max: 0, min: 3 },
    proximo: { max: 3, min: 6 },
    retos:   { max: 6, min: 10 },
    grandes: { max: 10, min: 100 },
  },
  '16_09_01_04_nic': {
    meta:    { max: 100, min: 95 },
    proximo: { max: 95, min: 90 },
    retos:   { max: 90, min: 85 },
    grandes: { max: 85, min: 0 },
  },
  '17_18_01_02_ipc': {
    meta:    { max: 3753.428621495327, min: 463.086709202649 },
    proximo: { max: 463.086709202649, min: 252.878939285507 },
    retos:   { max: 252.878939285507, min: 42.67116936836493 },
    grandes: { max: 42.67116936836493, min: 0 },
  },
};

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
let legendPeriod = 'v1';  // default: período inicial

function setLegendPeriod(period) {
  legendPeriod = period;
  const b1 = document.getElementById('leg-btn-p1');
  const b2 = document.getElementById('leg-btn-p2');
  if (b1) b1.classList.toggle('active', period === 'v1');
  if (b2) b2.classList.toggle('active', period === 'v2');
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

  // Use centralized thresholds file instead of per-Excel Umbral sheet
  const code = result.indicatorCode;
  if (ALL_THRESHOLDS[code]) {
    result.thresholds = ALL_THRESHOLDS[code];
  } else if (workbook.SheetNames.includes('Umbral')) {
    // Fallback: read from Excel if not in central file
    const urows = XLSX.utils.sheet_to_json(workbook.Sheets['Umbral'], { header:1 });
    if (urows.length > 1) {
      const r = urows[1];
      result.thresholds = {
        meta:    { max:parseFloat(r[2]), min:parseFloat(r[3]) },
        proximo: { max:parseFloat(r[4]), min:parseFloat(r[5]) },
        retos:   { max:parseFloat(r[6]), min:parseFloat(r[7]) },
        grandes: { max:parseFloat(r[8]), min:parseFloat(r[9]) },
      };
    }
  }

  // Get indicator name from Umbral sheet
  if (workbook.SheetNames.includes('Umbral')) {
    const urows = XLSX.utils.sheet_to_json(workbook.Sheets['Umbral'], { header:1 });
    if (urows.length > 1) result.indicatorName = urows[1][1] || '';
  }

  setLoading(false);
  return result;
}

function classify(value, thresholds) {
  if (value === null || value === undefined || isNaN(value)) return 'sin';
  if (!thresholds) return 'sin';
  const t = thresholds;

  // Detectar dirección del indicador:
  // Caso 1: meta_max < meta_min → descendente (menor es mejor)
  // Caso 2: meta_max > meta_min → ascendente (mayor es mejor)
  // Caso 3: meta_max == meta_min (ej. ambos = 0) → usar proximo para decidir
  let ascending;
  if (t.meta.max === t.meta.min) {
    // Empate en meta: mirar proximo para decidir dirección
    // Si proximo_min > proximo_max → los valores suben → descendente
    ascending = t.proximo.min <= t.proximo.max;
  } else {
    ascending = t.meta.max > t.meta.min;
  }

  if (ascending) {
    // Mayor es mejor (ej. alfabetismo, cobertura agua)
    if (value >= t.meta.min)    return 'meta';
    if (value >= t.proximo.min) return 'proximo';
    if (value >= t.retos.min)   return 'retos';
    return 'grandes';
  } else {
    // Menor es mejor (ej. hacinamiento, deforestación, pobreza)
    if (value <= t.meta.min)    return 'meta';
    if (value <= t.proximo.min) return 'proximo';
    if (value <= t.retos.min)   return 'retos';
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
  const vals1 = [], vals2 = [];
  for (const [,entry] of mun) {
    if (entry.v1 !== null) vals1.push(entry.v1);
    if (entry.v2 !== null) vals2.push(entry.v2);
  }
  if (!vals1.length && !vals2.length) { dom.statsSection.style.display='none'; return; }

  const fmt = arr => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1) : '—';
  const fmax = arr => arr.length ? Math.max(...arr).toFixed(1) : '—';
  const fmin = arr => arr.length ? Math.min(...arr).toFixed(1) : '—';

  dom.statsContainer.innerHTML = `
    <div class="stats-period-row">
      <div class="stats-period-col stats-period-initial">
        <div class="stats-period-label" id="stats-label-v1">Período inicial</div>
        <div class="stat-card"><div class="stat-value">${fmt(vals1)}</div><div class="stat-label">Promedio</div></div>
        <div class="stat-card"><div class="stat-value">${fmax(vals1)}</div><div class="stat-label">Máximo</div></div>
        <div class="stat-card"><div class="stat-value">${fmin(vals1)}</div><div class="stat-label">Mínimo</div></div>
      </div>
      <div class="stats-divider"></div>
      <div class="stats-period-col stats-period-final">
        <div class="stats-period-label" id="stats-label-v2">Período final</div>
        <div class="stat-card"><div class="stat-value">${fmt(vals2)}</div><div class="stat-label">Promedio</div></div>
        <div class="stat-card"><div class="stat-value">${fmax(vals2)}</div><div class="stat-label">Máximo</div></div>
        <div class="stat-card"><div class="stat-value">${fmin(vals2)}</div><div class="stat-label">Mínimo</div></div>
      </div>
    </div>
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
          Umbrales ODS
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
  if (!dom.munSearch) return;
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

  // Add listeners only to elements that exist
  const selEl = $('indicator-select');
  if (selEl) selEl.addEventListener('change', e => onIndicatorChange(e.target.value));
  if (dom.btnMunicipal)  dom.btnMunicipal.addEventListener('click', () => onLevelChange('municipal'));
  if (dom.btnExport)     dom.btnExport.addEventListener('click', exportPNG);
  if (dom.btnFullscreen) dom.btnFullscreen.addEventListener('click', toggleFullscreen);
  document.addEventListener('mousemove', e => {
    const tt = $('map-tooltip');
    if (tt && !tt.classList.contains('hidden')) positionTooltip(e);
  });

  setLoading(false);
}

// Called by landing page button
function enterAtlasAndLoad() {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('atlas-app').classList.remove('hidden');
  setTimeout(() => {
    if (mapLeft)  mapLeft.invalidateSize();
    if (mapRight) mapRight.invalidateSize();
    const sel = $('indicator-select');
    if (sel && INDICATOR_FILES.length > 0) {
      sel.value = INDICATOR_FILES[0].file;
      sel.dispatchEvent(new Event('change'));
    }
  }, 150);
}

document.addEventListener('DOMContentLoaded', init);
