# Atlas Territorial Bolivia · Indicadores ODS
**Plataforma interactiva de visualización territorial — GitHub Pages**

---

## Descripción

Plataforma web estática para comparar indicadores de desarrollo entre 2012 y 2024 a nivel municipal y departamental en Bolivia. Funciona completamente en el frontend, sin servidor, compatible con GitHub Pages.

---

## Estructura del proyecto

```
atlas-bolivia/
│
├── index.html          ← Interfaz principal
├── style.css           ← Estilos del atlas
├── script.js           ← Lógica de mapas y datos
├── README.md
│
├── data/
│   ├── indicadores/    ← Archivos Excel (.xlsx) — uno por indicador
│   │   ├── alfabetismo.xlsx
│   │   ├── abandono_escolar.xlsx
│   │   └── pobreza.xlsx
│   │
│   └── geojson/        ← Geometrías territoriales
│       ├── municipios.geojson
│       └── departamentos.geojson
│
└── assets/             ← Logos, imágenes opcionales
```

---

## Publicación en GitHub Pages

### Paso 1: Crear repositorio

```bash
git init
git add .
git commit -m "Atlas Bolivia inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/atlas-bolivia.git
git push -u origin main
```

### Paso 2: Activar GitHub Pages

1. Ir a **Settings → Pages**
2. Source: **Deploy from branch**
3. Branch: **main** · Folder: **/ (root)**
4. Guardar

La URL será: `https://TU_USUARIO.github.io/atlas-bolivia/`

### Paso 3: Actualizar indicadores sin código

Solo copia nuevos archivos `.xlsx` en `data/indicadores/` y registra el archivo en `script.js`:

```js
// En script.js, añadir a INDICATOR_FILES:
const INDICATOR_FILES = [
  { file: 'alfabetismo.xlsx',     label: 'Tasa de Alfabetismo' },
  { file: 'nuevo_indicador.xlsx', label: 'Nuevo Indicador' },  // ← agregar
];
```

---

## Formato de archivos Excel

Cada archivo `.xlsx` debe tener **exactamente estas hojas**:

### Hoja `Indicador_MUN`

| id    | Municipio | %_Indicador_2012 | %_Indicador_2024 |
|-------|-----------|-----------------|-----------------|
| 10101 | Sucre     | 94.8            | 95.7            |
| 10102 | Yotala    | 87.3            | 89.5            |

- **Columna 1**: id numérico del municipio (5 dígitos)
- **Columna 2**: Nombre del municipio
- **Columna 3**: Valor período inicial
- **Columna 4**: Valor período final
- Los nombres de columna pueden variar — el sistema usa posición

### Hoja `Absoluto_MUN`

Misma estructura, con valores absolutos (no porcentuales).

### Hoja `Indicador_DEP`

| id | Departamento | valor_2012 | valor_2024 |
|----|-------------|-----------|-----------|
| 1  | Chuquisaca  | 88.1      | 91.4      |

### Hoja `Absoluto_DEP`

Misma estructura, con valores absolutos.

### Hoja `Umbral`

| ODS | Indicador | Meta max | Meta min | Próximo max | Próximo min | Retos max | Retos min | Grandes max | Grandes min |
|-----|-----------|---------|---------|------------|------------|----------|----------|------------|------------|
| 4   | Alfabetismo | 100  | 95      | 95         | 85         | 85       | 70       | 70         | 0          |

- Los umbrales **solo aplican** a `Indicador_MUN`
- Para indicadores donde **mayor es mejor** (alfabetismo, acceso a servicios):
  - Meta: valor ≥ Meta_min
- Para indicadores donde **menor es mejor** (pobreza, abandono):
  - Meta: valor ≤ Meta_max

---

## Conversión de GeoPackage a GeoJSON

### Requisito: QGIS (gratuito)

1. Abrir QGIS
2. Cargar la capa GeoPackage (`.gpkg`)
3. Click derecho en la capa → **Export → Save Features As…**
4. Formato: **GeoJSON**
5. Sistema de referencia: **WGS 84 (EPSG:4326)**
6. Nombre del archivo: `municipios.geojson`

### Con ogr2ogr (línea de comandos)

```bash
# Municipios
ogr2ogr -f GeoJSON -t_srs EPSG:4326 \
  data/geojson/municipios.geojson \
  municipios.gpkg municipios

# Departamentos
ogr2ogr -f GeoJSON -t_srs EPSG:4326 \
  data/geojson/departamentos.geojson \
  departamentos.gpkg departamentos
```

### Propiedades requeridas en GeoJSON

El archivo GeoJSON debe incluir en `properties`:

```json
{
  "type": "Feature",
  "properties": {
    "id": "10101",
    "municipio": "Sucre"
  },
  "geometry": { ... }
}
```

El campo `id` es el que se usa para unir con los datos Excel.

### Simplificación para rendimiento (recomendado)

```bash
# Instalar mapshaper
npm install -g mapshaper

# Simplificar preservando topología
mapshaper municipios.geojson \
  -simplify dp 15% keep-shapes \
  -o data/geojson/municipios.geojson
```

---

## Personalización

### Cambiar colores ODS

En `script.js`, modificar:

```js
const ODS_COLORS = {
  meta:    '#16a34a',  // Verde
  proximo: '#ca8a04',  // Amarillo
  retos:   '#ea580c',  // Naranja
  grandes: '#dc2626',  // Rojo
  sin:     '#d1d5db',  // Gris
};
```

### Cambiar centro del mapa

```js
const BOLIVIA_CENTER = [-16.5, -64.5];
const BOLIVIA_ZOOM   = 6;
```

### Cambiar mapa base

```js
// En initMaps(), cambiar tileUrl:
// Cartografía oscura:
const tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
// OpenStreetMap estándar:
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
```

---

## Funcionalidades implementadas

| Funcionalidad | Estado |
|---------------|--------|
| Doble mapa sincronizado | ✅ |
| Selector dinámico de indicadores | ✅ |
| Clasificación ODS automática | ✅ |
| Leyenda dinámica con conteos | ✅ |
| Tooltips interactivos | ✅ |
| Panel de municipio seleccionado | ✅ |
| Búsqueda de municipios | ✅ |
| Nivel municipal / departamental | ✅ |
| Resumen estadístico nacional | ✅ |
| Zoom sincronizado | ✅ |
| Pantalla completa | ✅ |
| Responsive (desktop/tablet/móvil) | ✅ |
| Sin backend | ✅ |
| Compatible GitHub Pages | ✅ |

---

## Tecnologías

- **HTML5 / CSS3 / JavaScript ES2022**
- **Leaflet.js 1.9.4** — mapas interactivos
- **SheetJS (xlsx)** — lectura de archivos Excel
- **Fuentes**: Sora + DM Mono (Google Fonts)
- **Mapas base**: CartoDB Light (sin etiquetas)

---

## Créditos y licencia

Desarrollado para visualización de indicadores territoriales de Bolivia.
Datos: INE Bolivia, encuestas nacionales 2012–2024.
Mapa base: © OpenStreetMap contributors, © CARTO.
