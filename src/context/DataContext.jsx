import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { restaurantAPI, couponAPI } from '../api'
import { restaurants as fallbackRestaurants, cuisines as fallbackCuisines } from '../data/restaurants'
import { foods as fallbackFoods } from '../data/foods'
import { coupons as fallbackCoupons } from '../data/coupons'

const DataContext = createContext(null)

// Local demo data uses `id`, while MongoDB API responses use `_id`. Keep one
// predictable shape for every screen so links, menus and cart actions work in
// both offline and API-backed modes.
const normalizeId = (value) => (value === undefined || value === null ? value : String(value))

const normalizeRestaurant = (restaurant) => ({
  ...restaurant,
  id: normalizeId(restaurant.id ?? restaurant._id),
})

const normalizeFood = (food) => ({
  ...food,
  id: normalizeId(food.id ?? food._id),
  restaurantId: normalizeId(food.restaurantId),
})

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
      setRestaurants(rests.map(normalizeRestaurant))
      setFoods(allFoods.map(normalizeFood))
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
