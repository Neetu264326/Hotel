import { useEffect, useState } from 'react'
import { BarChart3, Users, Store, UtensilsCrossed, Package, IndianRupee, Trash2, Plus } from 'lucide-react'
import { adminAPI } from '../api'
import { useData } from '../context/DataContext'

const statuses = ['placed', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled']
const titleize = (value) => value.replaceAll('-', ' ')

const AdminDashboard = () => {
  const { restaurants, foods, reload } = useData()
  const [dashboard, setDashboard] = useState(null)
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('overview')
  const [error, setError] = useState('')
  const [restaurantForm, setRestaurantForm] = useState({ name: '', cuisine: '', deliveryTime: 30, deliveryFee: 40, priceRange: '₹200 - ₹500' })
  const [foodForm, setFoodForm] = useState({ name: '', restaurantId: '', price: '', category: '', description: '' })

  const load = async () => {
    try {
      const [summary, allOrders] = await Promise.all([adminAPI.dashboard(), adminAPI.orders()])
      setDashboard(summary); setOrders(allOrders); setError('')
    } catch (err) { setError(err.message) }
  }
  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    try { await adminAPI.updateOrderStatus(id, status); await load() } catch (err) { setError(err.message) }
  }
  const addRestaurant = async (event) => {
    event.preventDefault()
    try { await adminAPI.createRestaurant({ ...restaurantForm, rating: 4, reviews: 0, image: '', logo: '', description: '', categories: [] }); setRestaurantForm({ name: '', cuisine: '', deliveryTime: 30, deliveryFee: 40, priceRange: '₹200 - ₹500' }); await reload(); await load() } catch (err) { setError(err.message) }
  }
  const addFood = async (event) => {
    event.preventDefault()
    try { await adminAPI.createFood({ ...foodForm, price: Number(foodForm.price), restaurantId: foodForm.restaurantId, rating: 4, veg: true, bestseller: false, image: '', calories: 0, ingredients: [], sizes: [] }); setFoodForm({ name: '', restaurantId: '', price: '', category: '', description: '' }); await reload(); await load() } catch (err) { setError(err.message) }
  }
  const remove = async (kind, id) => {
    if (!window.confirm(`Delete this ${kind}? This cannot be undone.`)) return
    try { await (kind === 'restaurant' ? adminAPI.deleteRestaurant(id) : adminAPI.deleteFood(id)); await reload(); await load() } catch (err) { setError(err.message) }
  }
  const cards = dashboard ? [
    ['Orders', dashboard.totalOrders, Package], ['Revenue', `₹${dashboard.totalRevenue}`, IndianRupee], ['Customers', dashboard.totalCustomers, Users], ['Restaurants', dashboard.totalRestaurants, Store], ['Food items', dashboard.totalFoodItems, UtensilsCrossed],
  ] : []
  const inputStyle = { width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 9 }

  return <main className="container page-enter" style={{ padding: '36px 0 80px', minHeight: '70vh' }}>
    <h1 style={{ color: 'var(--navy)' }}>Admin Dashboard</h1><p style={{ color: 'var(--text-gray)', margin: '6px 0 24px' }}>Manage orders, restaurants and menu items from one place.</p>
    <nav style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 24 }}>{['overview', 'orders', 'restaurants', 'food'].map((item) => <button key={item} onClick={() => setTab(item)} className={tab === item ? 'btn btn-primary' : 'btn btn-outline'} style={{ textTransform: 'capitalize', padding: '9px 16px' }}>{item}</button>)}</nav>
    {error && <p role="alert" style={{ color: '#B91C1C', marginBottom: 16 }}>{error}</p>}
    {tab === 'overview' && <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>{cards.map(([label, value, Icon]) => <div key={label} style={{ padding: 20, background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow-sm)' }}><Icon color="var(--coral)" size={22}/><strong style={{ display: 'block', fontSize: 23, marginTop: 12 }}>{value}</strong><span style={{ color: 'var(--text-gray)', fontSize: 13 }}>{label}</span></div>)}</div>
      <section style={{ background: '#fff', padding: 22, borderRadius: 16, boxShadow: 'var(--shadow-sm)', marginTop: 20 }}><h2 style={{ fontSize: 18, marginBottom: 16 }}><BarChart3 size={19} style={{ verticalAlign: 'middle' }}/> Orders by status</h2>{dashboard?.statusCounts?.map((item) => <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', padding: '10px 0' }}><span style={{ textTransform: 'capitalize' }}>{titleize(item.id)}</span><strong>{item.count}</strong></div>)}</section>
    </>}
    {tab === 'orders' && <section style={{ overflowX: 'auto', background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow-sm)' }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}><thead><tr>{['Order', 'Customer', 'Total', 'Status'].map((h) => <th key={h} style={{ textAlign: 'left', padding: 15, borderBottom: '1px solid var(--border)' }}>{h}</th>)}</tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td style={{ padding: 15 }}>{order.orderId}</td><td style={{ padding: 15 }}>{order.user?.name || 'Customer'}<br/><small>{order.user?.email}</small></td><td style={{ padding: 15 }}>₹{order.total}</td><td style={{ padding: 15 }}><select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} style={inputStyle}>{statuses.map((status) => <option key={status} value={status}>{titleize(status)}</option>)}</select></td></tr>)}</tbody></table></section>}
    {tab === 'restaurants' && <><form onSubmit={addRestaurant} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, background: '#fff', padding: 18, borderRadius: 16, marginBottom: 18 }}>{Object.keys(restaurantForm).map((key) => <input key={key} required value={restaurantForm[key]} type={key.includes('Time') || key.includes('Fee') ? 'number' : 'text'} placeholder={key} onChange={(e) => setRestaurantForm({ ...restaurantForm, [key]: key.includes('Time') || key.includes('Fee') ? Number(e.target.value) : e.target.value })} style={inputStyle}/>)}<button className="btn btn-primary" type="submit"><Plus size={16}/> Add restaurant</button></form>{restaurants.map((r) => <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: 14, background: '#fff', borderRadius: 12, marginBottom: 8 }}><span><strong>{r.name}</strong><br/><small>{r.cuisine} · {r.deliveryTime} min</small></span><button onClick={() => remove('restaurant', r.id)} aria-label={`Delete ${r.name}`} style={{ color: '#DC2626' }}><Trash2 size={18}/></button></div>)}</>}
    {tab === 'food' && <><form onSubmit={addFood} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, background: '#fff', padding: 18, borderRadius: 16, marginBottom: 18 }}><input required placeholder="Food name" value={foodForm.name} onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })} style={inputStyle}/><select required value={foodForm.restaurantId} onChange={(e) => setFoodForm({ ...foodForm, restaurantId: e.target.value })} style={inputStyle}><option value="">Restaurant</option>{restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select><input required type="number" placeholder="Price" value={foodForm.price} onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })} style={inputStyle}/><input required placeholder="Category" value={foodForm.category} onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })} style={inputStyle}/><input placeholder="Description" value={foodForm.description} onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })} style={inputStyle}/><button className="btn btn-primary" type="submit"><Plus size={16}/> Add food</button></form>{foods.map((food) => <div key={food.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: 14, background: '#fff', borderRadius: 12, marginBottom: 8 }}><span><strong>{food.name}</strong><br/><small>{food.category} · ₹{food.price}</small></span><button onClick={() => remove('food', food.id)} aria-label={`Delete ${food.name}`} style={{ color: '#DC2626' }}><Trash2 size={18}/></button></div>)}</>}
  </main>
}
export default AdminDashboard
