import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { restaurantAPI, couponAPI } from '../api'
import { restaurants as fallbackRestaurants, cuisines as fallbackCuisines } from '../data/restaurants'
import { foods as fallbackFoods } from '../data/foods'
import { coupons as fallbackCoupons } from '../data/coupons'

const DataContext = createContext(null)

export const DataProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState(fallbackRestaurants)
  const [foods, setFoods] = useState(fallbackFoods)
  const [cuisines, setCuisines] = useState(fallbackCuisines)
  const [coupons, setCoupons] = useState(fallbackCoupons)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [rests, allFoods, cuis, allCoupons] = await Promise.all([
        restaurantAPI.getAll(),
        restaurantAPI.getFoodsAll(),
        restaurantAPI.getCuisines(),
        couponAPI.getAll(),
      ])
      setRestaurants(rests)
      setFoods(allFoods)
      setCuisines(cuis)
      setCoupons(allCoupons)
      setOffline(false)
    } catch (error) {
      console.warn('Backend unavailable, using local data:', error.message)
      setRestaurants(fallbackRestaurants)
      setFoods(fallbackFoods)
      setCuisines(fallbackCuisines)
      setCoupons(fallbackCoupons)
      setOffline(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <DataContext.Provider
      value={{
        restaurants,
        foods,
        cuisines,
        coupons,
        loading,
        offline,
        reload: loadData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}