export function getLineColorByVoltage(_voltage) {
  const voltage = Number(_voltage);
  // eslint-disable-next-line
  const weight = voltage >= 500000 ? 4 : voltage >= 220000 ? 3 : voltage >= 100000 ? 2 : voltage >= 35000 ? 1 : 2;

  return { color: '#50749a', weight, opacity: 0.5 };
}

export function getIncidentStylesByLevel(level) {
  const COLORS = ['#F44336', '#FF9800', '#FFEA00']; // [red, orange, yellow]
  return { color: COLORS[level - 1], weight: 2, dashArray: '3', fillColor: COLORS[level - 1], fillOpacity: 0.3 };
}

export function getClusterStyle() {
  return { color: '#FF9800', weight: 2, dashArray: '3', fillColor: '#F44336', fillOpacity: 0.3 };
}

export function getWidthByVoltage(_voltage) {
  const voltage = parseInt(_voltage, 10) / 1000;

  if (voltage <= 1) return 5;
  if (voltage <= 20) return 20;
  if (voltage <= 35) return 30;
  if (voltage <= 110) return 40;
  if (voltage <= 220) return 50;
  if (voltage <= 500) return 60;
  return 30;
}

export function getRegionColorByRating(rating) {
  const colors = {
    worst: '#c21a0c',
    bad: '#f78c03',
    normal: '#f8e004',
    good: '#bed701',
    best: '#68c621',
  };

  if (rating < 0.3) return colors.worst;
  if (rating < 0.5) return colors.bad;
  if (rating < 0.7) return colors.normal;
  if (rating < 0.9) return colors.good;
  return colors.best;
}

export function generateRegionsManager(regionsData, style, eachCb, L, map) {
  let lastStyle = null;
  let lastClicked = null;
  let regionsManager = null;

  const highlightFeature = e => {
    lastStyle = { ...e.target.options };

    e.target.setStyle({
      color: '#666',
      fillOpacity: 0.25,
    });
  };
  const resetHighlight = e => {
    if (e.target !== lastClicked) {
      e.target.setStyle(lastStyle);
    }
  };
  const zoomToFeature = e => {
    map.flyToBounds(e.target.getBounds());
    highlightFeature(e);
    if (lastClicked) {
      lastClicked.setStyle(lastStyle);
    }
    lastClicked = e.target;
  };

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature,
    });
    layer.bindTooltip(layer.feature.properties.name);

    if (typeof eachCb === 'function') eachCb(feature, layer);
  }

  regionsManager = L.geoJSON(regionsData, {
    style,
    onEachFeature,
  });

  return regionsManager;
}
