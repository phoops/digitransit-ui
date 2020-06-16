const CONFIG = 'mint';
const API_URL = process.env.API_URL || 'https://dev-api.digitransit.fi';
const MAP_URL =
  process.env.MAP_URL || 'https://maps.wikimedia.org/osm-intl/';
const APP_DESCRIPTION = 'Muoversi In Toscana - Travel Planner';
const YEAR = 1900 + new Date().getYear();
const APP_PATH = process.env.APP_CONTEXT || '';

export default {
  CONFIG,

  URL: {
    OTP: process.env.OTP_URL || `https://www-stg.muoversintoscana.it/gw/otp/routers/toscana/`,
    // STOP_MAP: `${MAP_URL}/map/v1/hsl-stop-map/`,
    // CITYBIKE_MAP: `${MAP_URL}/map/v1/hsl-citybike-map/`,
    // PARK_AND_RIDE_MAP: `${MAP_URL}/map/v1/hsl-parkandride-map/`,
    // TICKET_SALES_MAP: `${MAP_URL}/map/v1/hsl-ticket-sales-map/`,
    FONT: 'https://fonts.googleapis.com/css?family=Roboto|Roboto+Condensed',
    MAP: {
      default: `${MAP_URL}`
    },
    MAPBOX: 'https://api.mapbox.com/geocoding/v5/mapbox.places'
  },

  MAPBOX_TUSCANY_BOUNDARIES: '9.651662,42.424519,12.317661,44.499167',

  MAPBOX_ACCESS_TOKEN: 'pk.eyJ1IjoicGhvb3BzLW1hcGJveCIsImEiOiJjamM2ZWtzdnExNG9pMnFxbWV4ZXpoNjZ5In0.65trvqRy8RINZocVaFZYJg',

  map: {
    useRetinaTiles: true,
    tileSize: 256,
    zoomOffset: 0,
  },

  contactName: {
    sv: 'Muoversi In Toscana',
    fi: 'Muoversi In Toscana',
    default: 'Muoversi In Toscana',
  },

  APP_PATH: `${APP_PATH}`,
  title: 'Muoversi In Toscana',

  availableLanguages: ['it', 'en'],
  defaultLanguage: 'it',

  favicon: './app/configurations/images/mint/favicon.ico',

  // Navbar logo
  logo: 'mint/mint-dark.png',

  feedIds: ['1','2','3','4','5','6','7','8','9','10', 'CTT','CAP','COPIT'],

  showHSLTracking: false,

  defaultMapCenter: {
    lat: 43.7941,
    lon: 11.2219,
  },

  nearbyRoutes: {
    radius: 2000,
    bucketSize: 100,
  },

  maxWalkDistance: 2500,
  itineraryFiltering: 2.5, // drops 40% worse routes

  parkAndRide: {
    showParkAndRide: false,
    parkAndRideMinZoom: 14,
  },

  ticketSales: {
    showTicketSales: false,
    ticketSalesMinZoom: 16,
  },

  showDisclaimer: true,

  stopsMinZoom: 14,

  colors: {
    primary: '#E2001A',
  },

  sprites: 'svg-sprite.mint.svg',

  appBarLink: { name: 'Regione Toscana', href: 'http://www.regione.toscana.it/' },

  // nationalServiceLink: { name: 'Regione Toscana', href: 'http://www.regione.toscana.it/' },

  agency: {
    show: true,
  },

  socialMedia: {
    title: 'Muoversi In Toscana',
    description: APP_DESCRIPTION,

    image: {
      url: '/img/hsl-social-share.png',
      width: 400,
      height: 400,
    },

    twitter: {
      card: 'summary',
      site: '@HSL_HRT',
    },
  },

  meta: {
    description: APP_DESCRIPTION,
  },

  transportModes: {
    airplane: {
      availableForSelection: false,
      defaultValue: false,
    },
  },

  streetModes: {
    bicycle: {
      availableForSelection: true,
      defaultValue: false,
      icon: 'biking',
    },

    car_park: {
      availableForSelection: false,
      defaultValue: false,
      icon: 'car-withoutBox',
    },

    car: {
      availableForSelection: false,
      defaultValue: false,
      icon: 'car_park-withoutBox',
    },
  },

  search: {
    /* identify searches for route numbers/labels: bus | train | metro */
    lineRegexp: new RegExp(
      '(^[0-9]+[a-z]?$|^[yuleapinkrtdz]$|(^m[12]?b?$))',
      'i',
    ),
  },

  modesWithNoBike: ['BUS', 'TRAM'],
  
  useSearchPolygon: false,

  areaPolygon: [
    [25.5345, 60.2592],
    [25.3881, 60.1693],
    [25.3559, 60.103],
    [25.3293, 59.9371],
    [24.2831, 59.78402],
    [24.2721, 59.95501],
    [24.2899, 60.00895],
    [24.3087, 60.01947],
    [24.1994, 60.12753],
    [24.1362, 60.1114],
    [24.1305, 60.12847],
    [24.099, 60.1405],
    [24.0179, 60.1512],
    [24.0049, 60.1901],
    [24.0445, 60.1918],
    [24.0373, 60.2036],
    [24.0796, 60.2298],
    [24.1652, 60.2428],
    [24.3095, 60.2965],
    [24.3455, 60.2488],
    [24.428, 60.3002],
    [24.5015, 60.2872],
    [24.4888, 60.3306],
    [24.5625, 60.3142],
    [24.5957, 60.3242],
    [24.6264, 60.3597],
    [24.666, 60.3638],
    [24.7436, 60.3441],
    [24.9291, 60.4523],
    [24.974, 60.5253],
    [24.9355, 60.5131],
    [24.8971, 60.562],
    [25.0388, 60.5806],
    [25.1508, 60.5167],
    [25.1312, 60.4938],
    [25.0385, 60.512],
    [25.057, 60.4897],
    [25.0612, 60.4485],
    [25.1221, 60.4474],
    [25.1188, 60.4583],
    [25.149, 60.4621],
    [25.1693, 60.5062],
    [25.2242, 60.5016],
    [25.3661, 60.4118],
    [25.3652, 60.3756],
    [25.5345, 60.2592],
  ],

  // If certain mode(s) only exist in limited number of areas, that are unwanted or unlikely places for transfers,
  // listing the areas as a list of polygons for selected mode key will remove the mode(s) from queries if no coordinates
  // in the query are within the polygon(s). This reduces complexity in finding routes for the query.
  // modePolygons: {
  //   FERRY: [
  //     [
  //       [24.9793, 60.1513],
  //       [24.9695, 60.1485],
  //       [24.9871, 60.1365],
  //       [24.9913, 60.1379],
  //       [24.9952, 60.1457],
  //       [24.9916, 60.1488],
  //       [24.9793, 60.1513],
  //     ],
  //   ],
  // },

  footer: {
    content: [
      { label: `© Regione Toscana ${YEAR}` },
      {
        name: 'accessibility',
        nameEn: 'Accessibility',
        href: 'http://www.regione.toscana.it/accessibilita'
      },
      {
        name: 'legal-notes',
        nameEn: 'Legal notes',
        href: 'http://www.regione.toscana.it/notelegali'
      },
      {
        name: 'transparent-administration',
        nameEn: 'Transparent administration',
        href: 'http://www.regione.toscana.it/regione/amministrazione-trasparente',
      },
      {
        name: 'legal-advertising',
        nameEn: 'Legal advertising',
        href: 'http://www.regione.toscana.it/pubblicita-legale',
      },
      {
        name: 'privacy',
        nameEn: 'Privacy',
        href: 'http://www.regione.toscana.it/privacy',
      },
      {
        name: 'web-editorial-board',
        nameEn: 'Web editorial board',
        href: 'http://www.regione.toscana.it/redazioneweb',
      },
    ],
  },

  defaultEndpoint: {
    
  },

  defaultOrigins: [
    
  ],

  redirectReittiopasParams: true,
  queryMaxAgeDays: 14, // to drop too old route request times from entry url

  aboutThisService: {
    fi: [
      {
        header: 'Tietoja palvelusta',
        paragraphs: [
          'Tervetuloa Reittioppaaseen! Reittiopas kertoo, miten pääset nopeasti ja helposti perille joukkoliikenteellä Helsingissä, Espoossa, Vantaalla, Kauniaisissa, Keravalla, Kirkkonummella, Sipoossa, Siuntiossa ja Tuusulassa. Reittiopas etsii nopeat reitit myös kävelyyn ja pyöräilyyn sekä rajatusti myös yksityisautoiluun. Reittiopas-palvelun tarjoaa HSL Helsingin seudun liikenne, ja se perustuu Digitransit-palvelualustaan.',
        ],
      },
      {
        header: 'Tietolähteet',
        paragraphs: [
          'Kartat, tiedot kaduista, rakennuksista, pysäkkien sijainnista ynnä muusta tarjoaa © OpenStreetMap contributors. Osoitetiedot tuodaan Väestörekisterikeskuksen rakennustietorekisteristä. Joukkoliikenteen reitit ja aikataulut perustuvat HSL:n JORE-aineistoon.',
        ],
      },
    ],

    sv: [
      {
        header: 'Om tjänsten',
        paragraphs: [
          'Den här tjänsten erbjuds av HRT för reseplanering inom huvudstadsregionen (Helsingfors, Esbo, Vanda, Grankulla, Kervo, Kyrkslätt, Sibbo, Sjundeå och Tusby). Reseplaneraren täcker med vissa begränsningar kollektivtrafik, promenad, cykling samt privatbilism. Tjänsten baserar sig på Digitransit-plattformen.',
        ],
      },
      {
        header: 'Datakällor',
        paragraphs: [
          'Kartor, gator, byggnader, hållplatser och dylik information erbjuds av © OpenStreetMap contributors. Addressinformation hämtas från BRC:s byggnadsinformationsregister. Kollektivtrafikens rutter och tidtabeller är baserade på HRT:s JORE data.',
        ],
      },
    ],

    en: [
      {
        header: 'About this service',
        paragraphs: [
          'Welcome to the Journey Planner! The Journey Planner shows you how to get to your destination fast and easy by public transport in Helsinki, Espoo, Vantaa, Kauniainen, Kerava, Kirkkonummi, Sipoo, Siuntio and Tuusula. You can also use the planner to find fast walking and cycling routes, and to an extent, for driving directions. The Journey Planner is provided by HSL Helsinki Region Transport and it is based on the Digitransit service platform.',
        ],
      },
      {
        header: 'Data sources',
        paragraphs: [
          'Maps, streets, buildings, stop locations etc. are provided by © OpenStreetMap contributors. Address data is retrieved from the Building and Dwelling Register of the Finnish Population Register Center. Public transport routes and timetables are based on JORE data of HSL.',
        ],
      },
    ],

    it: [
      {
        header: 'Informazioni sul servizio',
        paragraphs: [
          'Benvenuto nel travel planner di Muoversi In Toscana! Il travel planner ti aiuta a dirigerti verso la tua destinazione in modo semplice e veloce utlizzando il trasporto della Toscana. Il travel planner è fornito da Regione Toscana ed è basato sulla piattaforma Digitransit.',
        ],
      },
      {
        header: 'Data sources',
        paragraphs: [
          'Le mappe, le informazioni sulle strade e sugli indirizzi sono fornite da © OpenStreetMap e Mapbox. Le informazioni sul trasporto pubblico sono fornite da Regione Toscana.',
        ],
      },
    ],
  },

  showTicketInformation: false,
  ticketLink: 'https://www.hsl.fi/liput-ja-hinnat',
  showTicketSelector: false,

  fares: [
    
  ],

  // mapping (string, lang) from OTP fare identifiers to human readable form
  fareMapping: function mapHslFareId(fareId, lang) {
    const names = {
      fi: {
        esp: 'Espoo ja Kauniainen',
        hki: 'Helsinki',
        ker: 'Kerava-Sipoo-Tuusula',
        kir: 'Kirkkonummi-Siuntio',
        kse: 'Lähiseutu 3',
        lse: 'Lähiseutu 2',
        seu: 'Seutulippu',
        van: 'Vantaa',
      },
      en: {
        esp: 'Espoo and Kauniainen',
        hki: 'Helsinki',
        ker: 'Kerava-Sipoo-Tuusula',
        kir: 'Kirkkonummi-Siuntio',
        kse: 'Region three zone',
        lse: 'Region two zone',
        seu: 'Regional ticket',
        van: 'Vantaa',
      },
      sv: {
        esp: 'Esbo och Grankulla',
        hki: 'Helsingfors',
        ker: 'Kervo-Sibbo-Tusby',
        kir: 'Kyrkslätt-Sjundeå',
        kse: 'Närregion 3',
        lse: 'Närregion 2',
        seu: 'Regionbiljett',
        van: 'Vanda',
      },
    };
    const mappedLang = names[lang] ? lang : 'fi';
    if (fareId && fareId.substring) {
      const zone = fareId.substring(
        fareId.indexOf(':') + 1,
        fareId.indexOf(':') + 4,
      );
      return names[mappedLang][zone];
    }
    return '';
  },

  staticMessages: [
    {
      id: '2',
      content: {
        en: [
          {
            type: 'text',
            content:
              'We use cookies to improve our services. By using this site, you agree to its use of cookies. Read more: ',
          },
          {
            type: 'a',
            content: 'Terms of use',
            href: 'http://www.regione.toscana.it/notelegali',
          },
          {
            type: 'a',
            content: 'Privacy Statement',
            href: 'http://www.regione.toscana.it/privacy',
          },
        ],
        it: [
          {
            type: 'text',
            content:
              "Per migliorare l'esperienza di navigazione delle pagine e di fruizione dei servizi online, questo sito utilizza cookie tecnici e analitici. Maggiori informazioni sui cookie dei siti di Regione Toscana: ",
          },
          {
            type: 'a',
            content: 'Note legali',
            href: 'http://www.regione.toscana.it/notelegali',
          },
          {
            type: 'a',
            content: 'Privacy policy',
            href: 'http://www.regione.toscana.it/privacy',
          },
        ],
      },
    },
  ],
  // staticMessagesUrl: 'https://www.muoversintoscana.it/news/',
  mapLayers: {
    featureMapping: {
      ticketSales: {
      },
    },
  },
};
