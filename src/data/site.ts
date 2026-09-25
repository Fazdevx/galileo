export const SITE = {
  name: 'Colegio y Academia Galileo',
  shortName: 'Galileo',
  legalName: 'Colegio y Academia Galileo',
  tagline: 'Educación de excelencia en Huacho',
  description:
    'Colegio y academia en Huacho, Perú, con más de 20 años formando estudiantes con valores y excelencia académica. Educación Inicial, Primaria, Secundaria y Academia Preuniversitaria.',
  locale: 'es_PE',
  lang: 'es',
  themeColor: '#1b2a4e',
  phone: {
    display: '+51 997 394 157',
    e164: '+51997394157',
    digits: '51997394157',
  },
  email: 'may8759@hotmail.com',
  /** Separate admissions line for the pre-university academy. */
  phoneAcademia: {
    display: '+51 967 540 629',
    e164: '+51967540629',
    digits: '51967540629',
  },
  address: {
    street: 'Av. Túpac Amaru 123',
    city: 'Huacho',
    region: 'Lima',
    country: 'PE',
    countryName: 'Perú',
    postalCode: '14211',
  },
  hours: [
    { days: 'Lunes a Viernes', opens: '08:00', closes: '18:00' },
    { days: 'Sábado', opens: '08:00', closes: '13:00' },
  ],
  hoursDisplay: 'Lun a Vie 8:00 - 18:00',
  social: {
    facebook: '',
    instagram: '',
    youtube: '',
    tiktok: '',
  },
} as const;

export const mapsQuery = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.countryName}`;

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`;

export const mapsLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

export const waLink = (message: string, digits: string = SITE.phone.digits) =>
  `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

export const SITE_URL = (import.meta.env.SITE || 'http://localhost:4321').replace(/\/$/, '');

export const fullAddress = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region}, ${SITE.address.countryName}`;
