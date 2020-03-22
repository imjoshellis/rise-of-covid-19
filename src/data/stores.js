import moment from 'moment'
import { derived, writable } from 'svelte/store'

export const data = writable({})
export const dates = writable([])

export const area = writable('global')

export const countryStr = writable('')
export const allCountries = writable({})
export const countries = derived([countryStr, data], ([$countryStr, $data]) => {
  if ($countryStr === '') {
    return Object.keys($data.countries).sort()
  }

  var re = new RegExp($countryStr, 'gi')

  return Object.keys($data.countries)
    .filter(word => word.match(re))
    .sort()
})

export const dateMax = writable(0)
export const dateIdx = writable(0)
export const dateValue = derived([dates, dateIdx], ([$dates, $dateIdx]) => new Date($dates[$dateIdx]))

export const subAreas = derived([data, area, dateValue], ([$data, $area, $dateValue]) => {
  let subAreas = []
  if ($area === 'global') {
    for (const country in $data.countries) {
      const today = moment($dateValue)
        .utc()
        .format()
      const todayActive = $data.countries[country].total.active[today]
      const yesterday = moment($dateValue)
        .subtract(1, 'days')
        .utc()
        .format()
      const yesterdayActive = $data.countries[country].total.active[yesterday]
      const twoAgo = moment($dateValue)
        .subtract(2, 'days')
        .utc()
        .format()
      const twoActive = $data.countries[country].total.active[twoAgo]
      const threeAgo = moment($dateValue)
        .subtract(3, 'days')
        .utc()
        .format()
      const threeActive = $data.countries[country].total.active[threeAgo]
      const subArea = {
        name: country,
        today: todayActive,
        yesterday: yesterdayActive,
        twoAgo: twoActive,
        threeAgo: threeActive
      }
      subAreas = [...subAreas, subArea]
    }
  }
  console.log(subAreas[0].today)
  return subAreas
})
