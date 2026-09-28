export const SITE = {
  name: 'Colegio y Academia Galileo',
  shortName: 'Galileo',
  legalName: 'Colegio y Academia Galileo',
  tagline: 'Educación de excelencia en Huacho',
  /**
   * Año de fundación. Única fuente de la antigüedad en todo el sitio: el
   * schema.org del Layout, el pie, el Hero y las meta descripciones lo leen
   * de aquí. El colegio cumple 4 años en 2026, así que 2026 - 4 = 2022.
   *
   * Antes ponía 2005 y por eso el sitio decia "más de 20 años" en todas
   * partes. Si cambia, se cambia solo aquí.
   */
  fundacion: 2022,
  description:
    'Colegio y academia en Huacho, Perú, formando estudiantes con valores y excelencia académica. Educación Inicial, Primaria, Secundaria y Academia Preuniversitaria.',
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

/** Años cumplidos de trayectoria a la fecha de hoy. */
export const ANIOS_TRAYECTORIA = new Date().getFullYear() - SITE.fundacion;

/**
 * Texto de trayectoria para las frases de prosa ("con 4 años de trayectoria,
 * ofrecemos..."). El redondeo a múltiplos de cinco protege de pasarse (con 21
 * años diría "más de 20"), pero con un colegio joven se rompe: a los 4 años
 * daría "más de 0 años". Por eso solo redondea a partir del primer lustro.
 *
 * Para el dato suelto del Hero usa ANIOS_ANTIGUEDAD, que sí va sin redondear.
 */
export const ANIOS_ANTIGUEDAD = ANIOS_TRAYECTORIA;

export const TRAYECTORIA =
  ANIOS_TRAYECTORIA >= 5
    ? `más de ${Math.floor(ANIOS_TRAYECTORIA / 5) * 5} años de trayectoria`
    : `${ANIOS_TRAYECTORIA} años de trayectoria`;
export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`;

export const mapsLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

export const waLink = (message: string, digits: string = SITE.phone.digits) =>
  `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

export const SITE_URL = (import.meta.env.SITE || 'http://localhost:4321').replace(/\/$/, '');

export const fullAddress = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region}, ${SITE.address.countryName}`;
