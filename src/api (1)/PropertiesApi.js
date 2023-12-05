import { Auth } from 'aws-amplify';


class PropertiesApi {

  async saveProperty(property) {
    const token = await Auth.currentSession().then(
      data => data.getIdToken().getJwtToken()
    
    )
    return await fetch('https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(property)
    })
    .then(response => response.json())
    .then(data => {
        return data.propertyId;
      })
     .catch(err => {
       console.log(err)
     });    
  }

  async saveCertificate(cert) {
    const token = await Auth.currentSession().then(
      data => data.getIdToken().getJwtToken()
    
    )
       
    return await fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/${cert.propertyId}/certificates`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(cert)
    })
    .catch(err => {
      console.log(err)
    })
    
    
        
  } 

  async saveTasks(cert,name) {
   const token = await Auth.currentSession().then(
    data => data.getIdToken().getJwtToken()
    
    )
    return await fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/tasks`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(cert,name)
    })
    .catch(err => {
      console.log(err)
    })
  } 

     
  async saveInsurance(insurance) {
    const token = await Auth.currentSession().then(
      data => data.getIdToken().getJwtToken()
      )
    
    return await fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/${insurance.propertyId}/insurances`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(insurance)
    })
    .catch(err => {
      console.log(err)
    })
  } 
 
  async saveTenancies(tenancies) {
    const token = await Auth.currentSession().then(
      data => data.getIdToken().getJwtToken()
    
    )

    return await fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/${tenancies.propertyId}/tenancies`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(tenancies)
    })
    .catch(err => {
      console.log(err)
    })
  } 

  async saveTenant(tenant) {
    const token = await Auth.currentSession().then(
      data => data.getIdToken().getJwtToken()
      )
    return await fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/${tenant.propertyId}/tenancies/{tenanciesId}/tenants`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(tenant)
    })
    .catch(err => {
      console.log(err)
    })
  } 

  async getInsurances(propertyId){
    const token = await Auth.currentSession().then(
      data => data.getIdToken().getJwtToken()
      )
    return(
    fetch( 'https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/'+propertyId+'/insurances', 
    {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
       
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
        'Content-Type': 'application/json',
        'Authorization': token
        },
        //redirect: 'follow', // manual, *follow, error
        //referrerPolicy: 'no-referrer',// no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url,
        })
        .then(response => response.json())
        .then(data => {  return data.Items})
        .catch((error) => { console.warn(error) })
    )}
  
    async getTasks(){
      const token = await Auth.currentSession().then(
        data => data.getIdToken().getJwtToken()
      )
      return(
      fetch( 'https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/tasks', 
      {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
         
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
          'Content-Type': 'application/json',
          'Authorization': token
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer',// no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url,
          })
          .then(response => response.json())
          .then(data => {return data.Items})
          .catch((error) => { console.warn(error) })
      )}

      async getDueTasks(){
        const token = await Auth.currentSession().then(
          data => data.getIdToken().getJwtToken()
        )
        return(
        fetch( 'https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/tasks', 
        {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
           
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'Content-Type': 'application/json',
            'Authorization': token
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',// no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url,
            })
            .then(response => response.json())
            .then(data => {return data.Items})
            .catch((error) => { console.warn(error) })
        )}


    async getTenancies(propertyId){
      const token = await Auth.currentSession().then(
        data => data.getIdToken().getJwtToken()
      
      )
    return(
    fetch( 'https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/'+propertyId+'/tenancies', 
    {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
       // include, *same-origin, omit
        headers: {
        'Content-Type': 'application/json',
        'Authorization': token
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',// no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url,
        })
        .then(response => response.json())
        .then(data => {  return data.Items})
        .catch((error) => { console.warn(error) })
    )}

  

 async lisTenancies(){
  const token = await Auth.currentSession().then(
    data => data.getIdToken().getJwtToken()
      
      )
    return(
    fetch( 'https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/{id}/tenancies/{tenanciesId}', 
    {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
       
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
         // include, *same-origin, omit
        headers: {
        'Content-Type': 'application/json',
        'Authorization': token
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',// no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url,
        })
        .then(response => response.json())
        .then(data => {  return data.Items})
        .catch((error) => { console.warn(error) })
    )}

  async getCertificates(propertyId){
    const token = await Auth.currentSession().then(
      data => data.getIdToken().getJwtToken()
    )
    return(
    fetch( 'https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/'+propertyId+'/certificates', 
    {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
        'Content-Type': 'application/json',
        'Authorization': token
        },
        //redirect: 'follow', // manual, *follow, error
        //referrerPolicy: 'no-referrer',// no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url,
        })
        .then(response => response.json())
        .then(data => {return data.Items})
        .catch((error) => { console.warn(error) })
    )}

  
    

    
   
  async getProperties(){
    const token = await Auth.currentSession().then(
    data => data.getIdToken().getJwtToken()
    
    )
    console.log(token)
    return(
     
    fetch( 'https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties', 
    {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
       
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: '*', // include, *same-origin, omit
        headers: {
        'Content-Type': 'application/json',
        'Authorization':  token
        },
        //redirect: 'follow', // manual, *follow, error
        //referrerPolicy: 'no-referrer',// no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url,
        })

        .then(response => response.json())
        .then(data => {return data.Items})
        .catch((error) => { console.warn(error) })
    )
 /*  }) */
 
  }
     

  async updateCertificate(certt) {
   const token = await Auth.currentSession().then(
    data => data.getIdToken().getJwtToken()
      )
      return await fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/${certt.propertyId}/certificates/${certt.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization':  token
        },
        body: JSON.stringify(certt)
      })
      .catch(err => {
        console.log(err)
      })
    }  

    async updateTasks(task) {
      const token = await Auth.currentSession().then(
        data => data.getIdToken().getJwtToken()
        )
      return await fetch(` https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(task)
      })
      .catch(err => {
        console.log(err)
      })
    }  
  
    async updateInsurance(insurancee) {
      const token = await Auth.currentSession().then(
        data => data.getIdToken().getJwtToken()
        )
      return await fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/${insurancee.propertyId}/insurances/${insurancee.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization':  token
        },
        body: JSON.stringify(insurancee)
      })
      .catch(err => {
        console.log(err)
      })
    }  
  
    async updateProperties(propertyy) {
      const token = await Auth.currentSession().then(
        data => data.getIdToken().getJwtToken()
        )
      return await fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/${propertyy.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization':  token
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(propertyy)
      })
      .catch(err => {
        console.log(err)
      })
    }  

    async getTenants(){
      const token = await Auth.currentSession().then(
        data => data.getIdToken().getJwtToken()
        )
      return(
      fetch('https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/${tenant.propertyId}/tenancies/${tenant.tenancyId}/tenants/${tenantId}', 
      {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          //credentials: 'same-origin', // include, *same-origin, omit
          headers: {
          'Content-Type': 'application/json',
           'Authorization':  token
          },
          //redirect: 'follow', // manual, *follow, error
          //referrerPolicy: 'no-referrer',// no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url,
          })
          .then(response => response.json())
          .then(data => {  return data.Items})
          .catch((error) => { console.warn(error) })
      )}

      async getTenantsOverview(propertyId){
        const token = await Auth.currentSession().then(
          data => data.getIdToken().getJwtToken()
          )
        return(
        fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/${propertyId}/tenancies/{tenanciesId}/tenants`, 
        {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'Content-Type': 'application/json',
            'Authorization':  token
            },
            //redirect: 'follow', // manual, *follow, error
            //referrerPolicy: 'no-referrer',// no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url,
            })
            .then(response => response.json())
            .then(data => {  return data.Items})
            .catch((error) => { console.warn(error) })
        )}
  

      async updateTenants(updateTenant){
        const token = await Auth.currentSession().then(
          data => data.getIdToken().getJwtToken()
          )
        return await fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/${updateTenant.propertyId}/tenancies/${updateTenant.tenancyId}/tenants/${updateTenant.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization':  token
        },
        body: JSON.stringify(updateTenant)
      })
      .catch(err => {
        console.log(err)
      })
    } 

    async updateTenancies(updateTenancy){
      const token = await Auth.currentSession().then(
        data => data.getIdToken().getJwtToken()
        ) 
      return await fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/${updateTenancy.propertyId}/tenancies/${updateTenancy.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization':  token
      },
      body: JSON.stringify(updateTenancy)
    })
    .catch(err => {
      console.log(err)
    })
  } 


    async getDocuments(){
       const token = await Auth.currentSession().then(
        data => data.getIdToken().getJwtToken()
        ) 
      return(
      fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/documents`, 
      {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          //credentials: 'same-origin', // include, *same-origin, omit
          headers: {
          'Content-Type': 'application/json',
          'Authorization':  token
          },
          //redirect: 'follow', // manual, *follow, error
          //referrerPolicy: 'no-referrer',// no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url,
          })
          .then(response => response.json())
          .then(data => {  return data.Items})
          .catch((error) => { console.warn(error) })
      )}

    async saveDocument(reg) {
      const token = await Auth.currentSession().then(
        data => data.getIdToken().getJwtToken()
        ) 
      return await fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/documents`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(reg)
      })
      .catch(err => {
        console.log(err)
      })
    } 

    async getNews(){
      /* const token = await Auth.currentSession().then(
        data => data.getIdToken().getJwtToken()
        ) */
      return(
        
        //https://newsapi.org/v2/top-headlines?country=gb&apiKey=39ad3ae862f14b0196b4d8dc035a99c6
      fetch(`https://newsapi.org/v2/top-headlines?country=gb&q=price&apiKey=39ad3ae862f14b0196b4d8dc035a99c6`, 
      {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          //credentials: 'same-origin', // include, *same-origin, omit
          headers: {
          //'Content-Type': 'application/json',
          //'Authorization':  token
          },
          //redirect: 'follow', // manual, *follow, error
          //referrerPolicy: 'no-referrer',// no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url,
          })
          .then(response => response.json())
          .then(data => {  return data.articles })
          .catch((error) => { console.warn(error) })
      )}

    async deleteDocument(doc){
      const token = await Auth.currentSession().then(
        data => data.getIdToken().getJwtToken()
        ) 
      return(
      fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/documents/${doc.id}`, 
      {
          method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify(doc)
        })
        .catch(err => {
          console.log(err)
        })
        )}
          
      async deleteProperty(property){
      const token = await Auth.currentSession().then(
        data => data.getIdToken().getJwtToken()
        ) 
      return(
      fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/${property.id}`, 
      {
          method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify(property)
        })
        .catch(err => {
          console.log(err)
        })
        )}

      async deleteTenancy(tenancy){
      const token = await Auth.currentSession().then(
        data => data.getIdToken().getJwtToken()
        ) 
      return(
      fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/{id}/tenancies/${tenancy.id}`, 
      {
        
          method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify(tenancy)
        })
        .catch(err => {
          console.log(err)
        })
        ) }
      async deleteTenants(tenant){
      const token = await Auth.currentSession().then(
        data => data.getIdToken().getJwtToken()
        ) 
      return(
      fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/properties/{id}/tenancies/{tenanciesId}/tenants/${tenant.id}`, 
      {
        
          method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify(tenant)
        })
        .catch(err => {
          console.log(err)
        })
        )}

      async deleteTasks(task){
        const token = await Auth.currentSession().then(
          data => data.getIdToken().getJwtToken()
          ) 
        return(
        fetch(`https://az1l99im39.execute-api.us-east-1.amazonaws.com/dev/tasks/${task.id}`, 
        {
          
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify(task)
          })
          .catch(err => {
            console.log(err)
          })
          )}       
          
       

    
  
}
export const propertiesApi = new PropertiesApi();