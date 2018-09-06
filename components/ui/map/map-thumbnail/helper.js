import 'isomorphic-fetch';

const BASEMAP_QUERY = 'SELECT the_geom_webmercator FROM gadm28_countries';
const BASEMAP_CARTOCSS = '#gadm28_countries { polygon-fill: #bbbbbb; polygon-opacity: 1; line-color: #FFFFFF; line-width: 0.5; line-opacity: 0.5; }';

export const getBasemapImage = ({
  width, height, zoom, lat, lng, format, layerSpec
}) => {
  const basemapSpec = {
    account: 'wri-01',
    body: {
      maxzoom: 18,
      minzoom: 3,
      layers: [{
        type: 'mapnik',
        options: {
          sql: BASEMAP_QUERY,
          cartocss: BASEMAP_CARTOCSS,
          cartocss_version: '2.3.0'
        }
      }]
    }
  };

  const { body, account } = basemapSpec;
  const layerTpl = { version: '1.3.0', stat_tag: 'API', layers: body.layers };
  const params = `?stat_tag=API&config=${encodeURIComponent(JSON.stringify(layerTpl))}`;
  const url = `https://${account}.carto.com/api/v1/map${params}`;

  return fetch(url)
    .then((response) => {
      if (response.status >= 400) throw new Error('Bad response from server');
      return response.json();
    })
    .then((data) => {
      const { layergroupid } = data;
      if (layerSpec.provider === 'gee' ||
        layerSpec.provider === 'nexgddp' ||
        layerSpec.provider === 'leaflet') {
        return `https://${data.cdn_url.https}/${account}/api/v1/map/${layergroupid}/0/0/0.${format || 'png'}`;
      }
      return `https://${data.cdn_url.https}/${account}/api/v1/map/static/center/${layergroupid}/${zoom}/${lat}/${lng}/${width}/${height}.${format || 'png'}`;
    });
};