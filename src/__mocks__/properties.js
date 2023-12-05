import { v4 as uuid } from 'uuid';

export default [
  {
    id: uuid(),
    purchaseDate: '01/12/2015',
    description: 'one be flat in sw11',
    media: '/static/images/properties/22A.png',
    title: '22A Eckstein Road',
    purchasePrice: 453000,
    currentPrice: 463000,
    postCode: 'SW11 1QF',
    propertyType: 'Flat',
    areaCode: 'E09000032',
    epc: 'Energy Performance Certificate',
    gasSafety: 'gas safety Certificate',
    patCertificate: 'PAT Certificate',
    contentInsurance: 'Buildings & Contents insurance',
    landlordEmergencyCover: 'TODO',
    rentLegalInsurance: 'TOOD',
    scheduledPropertyVisits: '01/12/2015'

  },
  {
    id: uuid(),
    purchaseDate: '01/04/2017',
    description: 'two large bed in SW11, Louveine Road ',
    media: '/static/images/properties/flat7.png',
    title: 'Flat 7 Louveine Road',
    purchasePrice: 512000,
    currentPrice: 532000,
    postCode: 'sw11 2AQ',
    propertyType: 'Detached',
    areaCode: 'E09000032'
  },
  {
    id: uuid(),
    purchaseDate: '01/04/2021',
    description: 'two bed in SW11, Louveine Road ',
    media: '/static/images/properties/flat6.png',
    title: 'Flat 6 Louveine Road',
    purchasePrice: 450000,
    currentPrice: 461000,
    postCode: 'SW11 2AQ',
    propertyType: 'Semi Detached',
    areaCode: 'E09000032'
  }
];
