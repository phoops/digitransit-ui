/* eslint-disable no-unused-vars */

export default mapboxFeatures => {
  // const mapping = config.search.peliasMapping;
  return mapboxFeatures.map(feature => {
    const mappedFeature = { ...feature };
    // const categories = feature.properties.category;
    // if (categories) {
    //   for (let i = 0; i < categories.length; i++) {
    //     const category = categories[i];
    //     if (category in mapping) {
    //       mappedFeature.properties.mode = mapping[category];

    //       if (config.search.peliasLayer) {
    //         mappedFeature.properties.layer = config.search.peliasLayer(
    //           category,
    //         );
    //       }
    //       break;
    //     }
    //   }
    // }
    // if (config.search.peliasLocalization) {
    //   return config.search.peliasLocalization(mappedFeature);
    // }
    let label = '';
    if (feature.address) {
      label = `${feature.text} ${feature.address}, ${feature.context[1].text}`;
    } else {
      label = feature.place_name;
    }

    mappedFeature.properties.label = label;
    mappedFeature.geometry.coordinates[0] = feature.geometry.coordinates[0];
    mappedFeature.geometry.coordinates[1] = feature.geometry.coordinates[1];

    // TODO: check Pelias feature format and return it
    return mappedFeature;
  });
};
