import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';
import WRISerializer from 'wri-json-api-serializer';


// Services
import GraphService from 'services/GraphService';

// Helpers
import { TAGS_BLACKLIST } from 'utils/tags';

// Thumbnails
import * as vega from 'vega';
import { getVegaTheme } from 'widget-editor';
import { getLayerImage } from 'layer-manager';


// DATASET
export const setDataset = createAction('EXPLORE-DETAIL/setDataset');
export const setDatasetLoading = createAction('EXPLORE-DETAIL/setDatasetLoading');
export const setDatasetError = createAction('EXPLORE-DETAIL/setDatasetError');
export const setDatasetThumbnail = createAction('EXPLORE-DETAIL/setDatasetThumbnail');
export const fetchDataset = createThunkAction('EXPLORE-DETAIL/fetchDataset', (payload = {}) => (dispatch, getState) => {
  const state = getState();
  dispatch(setDatasetLoading(true));
  dispatch(setDatasetError(null));

  return fetch(`${process.env.WRI_API_URL}/dataset/${payload.id}?application=${process.env.APPLICATIONS}&language=${state.common.locale}&includes=layer,metadata,vocabulary,widget&page[size]=9999`)
    .then((response) => {
      if (response.status >= 400) throw Error(response.statusText);
      return response.json();
    })
    .then(body => WRISerializer(body, { locale: state.common.locale }))
    .then((data) => {
      dispatch(setDatasetLoading(false));
      dispatch(setDatasetError(null));
      dispatch(setDataset(data));
    })
    .catch((err) => {
      dispatch(setDatasetLoading(false));
      dispatch(setDatasetError(err));
    });
});

export const fetchDatasetThumbnail = createThunkAction('EXPLORE-DETAIL/fetchDatasetThumbnail', () => (dispatch, getState) => {
  const state = getState();
  
  const dataset = state.exploreDetail.data;
  if (!dataset) {
    return;
  }

  const { widget } = dataset;
  if (!widget || !widget.length) {
    return;
  }

  const defaultWidget = dataset.widget.find(w => w.defaultEditableWidget || w.default);
  if (!defaultWidget) {
    return;
  }

  const { widgetConfig } = defaultWidget;
  const { type, layer_id } = widgetConfig;

  switch (type) {
    case 'map': {
      return fetch(`${process.env.WRI_API_URL}/layer/${layer_id}`)
        .then((response) => {
          if (response.status >= 400) throw Error(response.statusText);
          return response.json();
        })
        .then(body => WRISerializer(body, { locale: state.common.locale }))
        .then((layer) => {
          return getLayerImage({ layerSpec: layer })
            .then((url) => {
              dispatch(setDatasetThumbnail(url));
            })

        })

      break;
    }

    default:
      const widgetConfig = {
        ...defaultWidget.widgetConfig,
        config: getVegaTheme(),
        width: 400,
        height: 300,
        autosize: {
          type: 'fit',
          contains: 'padding'
        }
      };

      const runtime = vega.parse(widgetConfig);
      const view = new vega.View(runtime);

      return view
        .renderer('none')
        .initialize()
        .runAsync()
        .then(() => {
          view
            .toImageURL('png')
            .then((url) => {
              dispatch(setDatasetThumbnail(url));
            })
            .catch((err) => { console.error(err); });
        })
    break;
  }
});

// PARTNER
export const setPartner = createAction('EXPLORE-DETAIL/setPartner');
export const setPartnerLoading = createAction('EXPLORE-DETAIL/setPartnerLoading');
export const setPartnerError = createAction('EXPLORE-DETAIL/setPartnerError');
export const fetchPartner = createThunkAction('EXPLORE-DETAIL/fetchPartner', (payload = {}) => (dispatch) => {
  dispatch(setPartnerLoading(true));
  dispatch(setPartnerError(null));


  return fetch(new Request(`${process.env.API_URL}/partners/${payload.id}`))
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(({ data }) => {
      dispatch(setPartnerLoading(false));
      dispatch(setPartnerError(null));
      dispatch(setPartner({ ...data.attributes, id: data.id }));
    })
    .catch((err) => {
      dispatch(setPartnerLoading(false));
      dispatch(setPartnerError(err));
    });
});


// TAGS
export const setActiveTags = createAction('EXPLORE-DETAIL/setActiveTags');
export const setTags = createAction('EXPLORE-DETAIL/setTags');
export const setTagsLoading = createAction('EXPLORE-DETAIL/setTagsLoading');
export const setTagsError = createAction('EXPLORE-DETAIL/setTagsError');
export const fetchTags = createThunkAction('EXPLORE-DETAIL/fetchTags', () => (dispatch, getState) => {
  dispatch(setTagsLoading(true));
  dispatch(setTagsError(null));

  const tags = getState().exploreDetail.tags.active;
  const service = new GraphService();

  if (tags.length) {
    return service.getInferredTags(tags)
      .then((response) => {
        dispatch(setTags(response.filter(tag =>
          tag.labels.find(type => type === 'TOPIC' || type === 'GEOGRAPHY') &&
          !TAGS_BLACKLIST.includes(tag.id))));
      })
      .catch((err) => {
        dispatch(setTagsLoading(false));
        dispatch(setTagsError(err));
      });
  }

  return null;
});

// COUNT VIEW
export const setCountView = createThunkAction('EXPLORE-DETAIL/setCountView', () => (dispatch, getState) => {
  const { exploreDetail, user } = getState();

  const service = new GraphService();

  if (!user.token) {
    return;
  }

  service.countDatasetView(exploreDetail.data.id, user.token);
});
