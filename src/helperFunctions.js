export const parameterValidations = (parameters) => {
  // ensures user has selected a query engine
  if (parameters.engine === null) {
    window.alert('Please select a processing engine...')
    return false
  }
  // ensures user has selected a market
  if (parameters.market === null) {
    window.alert('Please select a market...')
    return false
  }
  // ensures user has selected a brand
  if (parameters.brand === null) {
    window.alert('Please select a brand...')
    return false
  }
  // ensures user has selected a current date range
  if (parameters.currStartDate === null || parameters.currEndDate === null) {
    window.alert('Please select a valid date range for current period')
    return false
  }
  // ensures user has selected both 'prev' date ranges if one has been selected
  if (parameters.prevStartDate !== null) {
    if (parameters.prevEndDate === null) {
      window.alert('Please select a valid date range for prior period')
      return false
    }
  } else if (parameters.prevStartDate === null) {
    if (parameters.prevEndDate !== null) {
      window.alert('Please select a valid date range for prior period')
      return false
    }
  }
  return true
}

export const slicerMapCreation = (
  queryNumber,
  jsonSlicer,
  jsonSlicer2,
  slicerCallback,
  payerSlicerMaps
) => {
  switch (queryNumber) {
    case 1:
      /* 

    
    
    */
      break

    case 2:
      const entToBobToPay = new Map()
      const payToBob = new Map()
      const bobToEnt = new Map()
      for (let objects in jsonSlicer) {
        let ent = jsonSlicer[objects]['ENTERPRISE']
        let bob = jsonSlicer[objects]['BOB']
        let payer = jsonSlicer[objects]['PAYER_ENTITY']
        // console.log(`Enter: ${ent}, BOB: ${bob}, payer: ${payer}`);
        if (entToBobToPay.has(ent)) {
          if (entToBobToPay.get(ent).has(bob)) {
            entToBobToPay.get(ent).get(bob).push(payer)
          } else {
            entToBobToPay.get(ent).set(bob, [])
            entToBobToPay.get(ent).get(bob).push(payer)
          }
        } else {
          entToBobToPay.set(ent, new Map())
          entToBobToPay.get(ent).set(bob, [])
          entToBobToPay.get(ent).get(bob).push(payer)
        }
      }

      for (let objects in jsonSlicer2) {
        let payer = jsonSlicer2[objects]['PAYER_ENTITY']
        let bobArr = jsonSlicer2[objects]['BOB_ARR']
        payToBob.set(payer, bobArr)
      }

      for (let Ent of entToBobToPay.keys()) {
        for (let bobs of entToBobToPay.get(Ent).keys()) {
          // console.log(`${Ent} and bob : ${bobs}`)
          // payToBob.set(entToBobToPay.get(Objects).get(bobs),bobs);
          bobToEnt.set(bobs, Ent)
        }
      }

      const slicers = {
        entToBobToPay: entToBobToPay,
        payToBob: payToBob,
        bobToEnt: bobToEnt,
      }
      slicerCallback(slicers)
      break

    case 3:
      break

    case 4:
      let startDateMap = new Map()
      let endDateMap = new Map()
      for (let rowNum in jsonSlicer) {
        let row_number = jsonSlicer[rowNum]['ROW_NUMBER']
        let s_w_s_d = jsonSlicer[rowNum]['SPLIT_WEEK_START_DATE']
        let s_w_e_d = jsonSlicer[rowNum]['SPLIT_WEEK_END_DATE']

        startDateMap.set(s_w_s_d, row_number)
        endDateMap.set(s_w_e_d, row_number)
      }
      const dates = {
        splitWeekStart: startDateMap,
        splitWeekEnd: endDateMap,
      }
      slicerCallback(dates)
      break

    default:
      return null
  }
}
// entToBobToPay
// payToBob
// bobToEnd

export const payerFilter = (maps, obj, statePayerArrays, setStatePayerArrays) => {
  if(maps === undefined || maps === null) {
    return
  }
  
  if (obj.payerentity === null && obj.enterprise === null && obj.bob === null) {
      console.log('ALL NULL PAYER SELECTEDD::::')
      let enterprises = []
      let bobs = []
      let payers = []
      let uniqueEnt = new Set()
      let uniqueBob = new Set()
      let uniquePay = new Set()
      for (let ent of maps.entToBobToPay.keys()) {
        if (uniqueEnt.has(ent)) {
        } else {
          uniqueEnt.add(ent)
          enterprises.push({ value: ent, label: ent })
        }
        for (let bob of maps.entToBobToPay.get(ent).keys()) {
          if (uniqueBob.has(maps.entToBobToPay.get(ent).get(bob))) {
          } else {
            uniqueBob.add(bob)
            bobs.push({ value: bob, label: bob })
          }
          for (let i in maps.entToBobToPay.get(ent).get(bob)) {
            if (uniquePay.has(maps.entToBobToPay.get(ent).get(bob)[i])) {
            } else {
              uniquePay.add(maps.entToBobToPay.get(ent).get(bob)[i])
              payers.push({ value: maps.entToBobToPay.get(ent).get(bob)[i], label: maps.entToBobToPay.get(ent).get(bob)[i] })
            }
          }
        }
      }
      setStatePayerArrays ({
        enterprises:enterprises,
        bobs:bobs,
        payers:payers
      })
  } else if (obj.enterprise && obj.payerentity === null && obj.bob === null) {
    console.log('ENT SELECTEDD::::',maps.entToBobToPay.get(obj.enterprise.toString()))
    // let enterprises = []
    let bobsArr = []
    let payersArr = []
    // let uniqueEnt = new Set()
    let uniqueBob = new Set()
    let uniquePay = new Set()
    obj.enterprise.forEach(enterprise => {
      for(let bobs of maps.entToBobToPay.get(enterprise.toString()).keys()) {
        if(uniqueBob.has(bobs)) {
  
        }else{
          uniqueBob.add(bobs)
          bobsArr.push({ value: bobs, label: bobs })
        }
        for (let i in maps.entToBobToPay.get(enterprise).get(bobs)) {
          if (uniquePay.has(maps.entToBobToPay.get(enterprise).get(bobs)[i])) {
          } else {
            uniquePay.add(maps.entToBobToPay.get(enterprise).get(bobs)[i])
            payersArr.push({ value: maps.entToBobToPay.get(enterprise).get(bobs)[i], label: maps.entToBobToPay.get(enterprise).get(bobs)[i] })
          }
        }
      }      
    });

    console.log(`bobs::: ${bobsArr}:::payers:::${payersArr}`)
    setStatePayerArrays ({
      ...statePayerArrays,
      bobs:bobsArr,
      payers:payersArr
    })
  }
  // else if(obj.enterprise && obj.bob && obj.payerentity === null ){
  //   let payerArr = []
  //   let uniquePayer = new Set();
  //   // obj.enterprise.forEach(bob => {
  //     // [ent1, ent2...] 
  //     // [bob1, bob2...]
  //   // }
    
    
  //   // for (let i in maps.entToBobToPay.get(enterprise).get(bobs)) {
  //   //   if (uniquePay.has(maps.entToBobToPay.get(enterprise).get(bobs)[i])) {
  //   //   } else {
  //   //     uniquePay.add(maps.entToBobToPay.get(enterprise).get(bobs)[i])
  //   //     payersArr.push({ value: maps.entToBobToPay.get(enterprise).get(bobs)[i], label: maps.entToBobToPay.get(enterprise).get(bobs)[i] })
  //   //   }
  //   // }
    
  // }

  
}



