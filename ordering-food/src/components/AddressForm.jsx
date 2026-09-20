import { useState } from "react";
import { Home, Building, MapPin, Plus, X, Check } from "lucide-react";
import { validateAddress } from "../utils/validation";

const savedAddresses = [
  {
    id: 1,
    type: "home",
    label: "Home",
    fullName: "Mohit Kumar",
    phone: "9876543210",
    house: "42, Sunrise Apartments",
    street: "12th Main, Koramangala",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560034",
    landmark: "Near Forum Mall",
  },
  {
    id: 2,
    type: "work",
    label: "Work",
    fullName: "Mohit Kumar",
    phone: "9876543210",
    house: "Tech Park, 5th Floor",
    street: "Whitefield Main Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560066",
    landmark: "Phoenix Mall opposite",
  },
];

const addressTypes = [
  { type: "home", label: "Home", icon: Home },
  { type: "work", label: "Work", icon: Building },
  { type: "other", label: "Other", icon: MapPin },
];

export default function AddressForm({ onSelectAddress, selectedAddressId }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState("home");
  const [addresses, setAddresses] = useState(savedAddresses);
  const [selected, setSelected] = useState(selectedAddressId || null);
  const [errors, setErrors] = useState({});
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    house: "",
    street: "",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "",
    landmark: "",
    type: "home",
  });

  const handleSelect = (addr) => {
    setSelected(addr.id);
    onSelectAddress(addr);
  };

  const handleAddNew = () => {
    setShowForm(true);
    setSelected(null);
    onSelectAddress(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value, type: selectedType }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { valid, errors: validationErrors } = validateAddress(address);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }
    const newAddress = {
      ...address,
      id: Date.now(),
      type: selectedType,
      label:
        selectedType === "home"
          ? "Home"
          : selectedType === "work"
          ? "Work"
          : "Other",
    };
    setAddresses((prev) => [...prev, newAddress]);
    setSelected(newAddress.id);
    onSelectAddress(newAddress);
    setShowForm(false);
    setAddress({
      fullName: "",
      phone: "",
      house: "",
      street: "",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "",
      landmark: "",
      type: "home",
    });
    setErrors({});
  };

  return (
    <>
      <div className="address-section">
        <h3 className="step-title">Delivery Address</h3>

        <div className="address-list">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`address-card ${selected === addr.id ? "selected" : ""}`}
              onClick={() => handleSelect(addr)}
            >
              <div className="address-card-radio">
                <div className="radio-circle">
                  {selected === addr.id && <Check size={12} />}
                </div>
              </div>
              <div className="address-card-content">
                <div className="address-card-type">
                  {addr.type === "home" ? <Home size={14} /> : addr.type === "work" ? <Building size={14} /> : <MapPin size={14} />}
                  <span>{addr.label}</span>
                </div>
                <p className="address-card-text">
                  {addr.house}, {addr.street}, {addr.city} - {addr.pincode}
                </p>
                <p className="address-card-name">{addr.fullName} | {addr.phone}</p>
              </div>
            </div>
          ))}
        </div>

        {!showForm && (
          <button className="add-address-btn" onClick={handleAddNew}>
            <Plus size={18} />
            Add New Address
          </button>
        )}

        {showForm && (
          <div className="address-form-container">
            <div className="address-form-header">
              <h4>Add New Address</h4>
              <button
                className="close-form-btn"
                onClick={() => setShowForm(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="address-type-selector">
              {addressTypes.map((t) => (
                <button
                  key={t.type}
                  className={`type-btn ${selectedType === t.type ? "active" : ""}`}
                  onClick={() => setSelectedType(t.type)}
                >
                  <t.icon size={16} />
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="address-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    name="fullName"
                    className={`form-input ${errors.fullName ? "error" : ""}`}
                    value={address.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                  {errors.fullName && <span className="form-error">{errors.fullName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    name="phone"
                    className={`form-input ${errors.phone ? "error" : ""}`}
                    value={address.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    maxLength={10}
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">House/Flat</label>
                  <input
                    name="house"
                    className={`form-input ${errors.house ? "error" : ""}`}
                    value={address.house}
                    onChange={handleChange}
                    placeholder="House/Flat number"
                  />
                  {errors.house && <span className="form-error">{errors.house}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Street</label>
                  <input
                    name="street"
                    className={`form-input ${errors.street ? "error" : ""}`}
                    value={address.street}
                    onChange={handleChange}
                    placeholder="Street address"
                  />
                  {errors.street && <span className="form-error">{errors.street}</span>}
                </div>
              </div>

              <div className="form-row form-row-3">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    name="city"
                    className="form-input"
                    value={address.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    name="state"
                    className="form-input"
                    value={address.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    name="pincode"
                    className={`form-input ${errors.pincode ? "error" : ""}`}
                    value={address.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                  {errors.pincode && <span className="form-error">{errors.pincode}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Landmark (optional)</label>
                <input
                  name="landmark"
                  className="form-input"
                  value={address.landmark}
                  onChange={handleChange}
                  placeholder="Nearby landmark"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Save Address
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .address-section {
          margin-bottom: 24px;
        }
        .step-title {
          font-size: 1.1rem;
          color: var(--navy);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .address-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
        }
        .address-card {
          display: flex;
          gap: 14px;
          padding: 16px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .address-card:hover {
          border-color: var(--gray-300);
        }
        .address-card.selected {
          border-color: var(--coral);
          background: rgba(255, 107, 53, 0.03);
        }
        .address-card-radio {
          padding-top: 2px;
        }
        .radio-circle {
          width: 20px;
          height: 20px;
          border: 2px solid var(--gray-300);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }
        .address-card.selected .radio-circle {
          border-color: var(--coral);
          background: var(--coral);
          color: white;
        }
        .address-card-type {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 4px;
        }
        .address-card-text {
          font-size: 0.85rem;
          color: var(--gray-600);
          margin-bottom: 4px;
        }
        .address-card-name {
          font-size: 0.8rem;
          color: var(--gray-400);
        }
        .add-address-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: var(--white);
          border: 2px dashed var(--gray-300);
          border-radius: var(--radius-md);
          color: var(--coral);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          width: 100%;
          justify-content: center;
        }
        .add-address-btn:hover {
          border-color: var(--coral);
          background: rgba(255, 107, 53, 0.03);
        }
        .address-form-container {
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        .address-form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .address-form-header h4 {
          color: var(--navy);
        }
        .close-form-btn {
          background: none;
          color: var(--gray-400);
          cursor: pointer;
          padding: 4px;
        }
        .close-form-btn:hover {
          color: var(--red);
        }
        .address-type-selector {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        .type-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-full);
          background: var(--white);
          color: var(--gray-600);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .type-btn:hover {
          border-color: var(--coral);
        }
        .type-btn.active {
          border-color: var(--coral);
          background: rgba(255, 107, 53, 0.05);
          color: var(--coral);
        }
        .address-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .form-row-3 {
          grid-template-columns: 1fr 1fr 1fr;
        }
        @media (max-width: 480px) {
          .form-row, .form-row-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
