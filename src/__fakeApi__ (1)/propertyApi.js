import { addDays, subDays, subHours, subMinutes } from 'date-fns';

const now = new Date();

class PropertyApi {
  getProperties() {
    const properties = [
      {
        id: '5e8dcef8f95685ce21f16f3d',
        tenant: {
          id: '5e887b7602bdbc4dbb234b27',
          avatar: '/static/mock-images/avatars/avatar-jie_yan_song.png',
          name: 'Jie Yan Song'
        },
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
        scheduledPropertyVisits: '01/12/2015',
        caption: 'One bedroom in Clapham',
        image: '/static/mock-images/properties/22A.png',
        updatedAt: subMinutes(now, 24).getTime()
      },
      {
        id: '5e8dcf076c50b9d8e756a5a2',
        tenant: {
          id: '5e887d0b3d090c1b8f162003',
          avatar: '/static/mock-images/avatars/avatar-omar_darobe.png',
          name: 'Omar Darobe'
        },
        purchaseDate: '01/04/2017',
        description: 'two large bed in SW11, Louveine Road ',
        title: 'Flat 7 Louveine Road',
        purchasePrice: 512000,
        currentPrice: 532000,
        postCode: 'sw11 2AQ',
        propertyType: 'Detached',
        areaCode: 'E09000032',
        caption: 'Two bedroom in Wandsworth',
        image: '/static/mock-images/properties/flat6.png',
        updatedAt: subHours(now, 1).getTime()
      },
      {
        id: '5e8dcf105a6732b3ed82cf7a',
        tenant: {
          id: '5e88792be2d4cfb4bf0971d9',
          avatar: '/static/mock-images/avatars/avatar-siegbert_gottfried.png',
          name: 'Siegbert Gottfried'
        },
        purchaseDate: '01/04/2021',
        description: 'two bed in SW11, Louveine Road ',
        title: 'Flat 6 Louveine Road',
        purchasePrice: 450000,
        currentPrice: 461000,
        postCode: 'SW11 2AQ',
        propertyType: 'Semi Detached',
        areaCode: 'E09000032',
        caption: 'Three bedroom in Clapham Junction',
        image: '/static/mock-images/properties/flat7.png',
        updatedAt: subHours(now, 16).getTime()
      }
    ];

    return Promise.resolve(properties);
  }

  getProperty(propertyId) {

    // console.log(this.getProperties())
    // var res = this.getProperties().filter(function(item) {
    //   return item.id == propertyId;
    // });
    // return res;

    const property =      {
      id: '5e8dcef8f95685ce21f16f3d',
      tenant: {
        id: '5e887b7602bdbc4dbb234b27',
        avatar: '/static/mock-images/avatars/avatar-jie_yan_song.png',
        name: 'Jie Yan Song'
      },
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
      scheduledPropertyVisits: '01/12/2015',
      caption: 'One bedroom in Clapham',
      image: '/static/mock-images/properties/22A.png',
      updatedAt: subMinutes(now, 24).getTime(),
      tenants :[
        {
          id: '254354',
          name: "Jie Yan Song",
          phone: "0745654748",
          email: "yan@here.com",
          avatar: '/static/mock-images/avatars/avatar-jie_yan_song.png'
        },
        {
          id: '53654',
          name: "Josh Go",
          phone: "0745666748",
          email: "josh@here.com",
          avatar: '/static/mock-images/avatars/avatar-fran_perez.png'
        }
      ],
      certificates: [
        {
          id: "fsfadsfs",
          type : "Gas Safety",
          issueDate: "01/12/2015",
          expiryDate: "01/12/2016",
          issuer: "British Gas",
          status: "expired"
        },
        {
          id: "fsfadsfs",
          type : "PAT",
          issueDate: "05/12/2015",
          expiryDate: "05/12/2021",
          issuer: "Electron",
          status: "valid"
        },
        {
          id: "fsfadsfs",
          type : "Electiry Safety (EICR)",
          issueDate: "05/12/2015",
          expiryDate: "05/12/2021",
          issuer: "Electron",
          status: "valid"
        }
      ],
      insurances: [
        {
          id: "gafgfdgd",
          type: "Building Insurance",
          issueDate: "05/12/2015",
          expiryDate: "05/12/2021",
          issuer: "Electron",
          status: "valid"
        },
        {
          id: "yetryter",
          type: "Content Insurance",
          issueDate: "05/12/2015",
          expiryDate: "05/12/2021",
          issuer: "Electron",
          status: "expired"
        },
        {
          id: "676457654",
          type: "Rent Protection Insurance",
          issueDate: "05/12/2015",
          expiryDate: "05/12/2021",
          issuer: "Electron",
          status: "pending"
        }
      ],
      tenancies: [
        {
          id: "gfsgsfd",
          startDate: "05/12/2015",
          endDate: "05/12/2016",
          price: "1600",
          status: "valid"
        },
        {
          id: "faga",
          startDate: "05/12/2014",
          endDate: "05/12/2015",
          price: "1600",
          status: "expired"
        },
        {
          id: "53654",
          startDate: "05/12/2013",
          endDate: "05/12/2014",
          price: "1600",
          status: "expired"
        }
      ]
    }

    return Promise.resolve(property);
  }
}

export const propertyApi = new PropertyApi();
