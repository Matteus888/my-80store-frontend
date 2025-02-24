import { useEffect, useState } from "react";
import styles from "../styles/order.module.css";
import { useSelector } from "react-redux";
import { AddHomeWorkTwoTone, CreditCardTwoTone } from "@mui/icons-material";
import UpdateAddressModal from "../components/UpdateAddressModal";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const [productsList, setProductsList] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const navigate = useNavigate();
  const cartTotalPrice = useSelector((state) => state.user.user.cart?.totalPrice || 0);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:3000/carts/", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setProductsList(data.cart);
        }
      } catch (error) {
        console.error("Error getting cart:", error);
      }
    };

    const fetchAddress = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/addresses", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setAddresses(data.addresses);

          if (data.addresses.length > 0) {
            setSelectedAddress(0);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchCart();
    if (user.publicId) {
      fetchAddress();
    }
  }, [user.publicId, updateTrigger]);

  const handleAddNewAdress = async (newAddress) => {
    try {
      const res = await fetch("http://localhost:3000/users/addAddress/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newAddress),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      const data = await res.json();
      console.log(data.message);

      setUpdateTrigger((prev) => !prev);
      setIsNewAddressModalOpen(false);
    } catch (err) {
      console.error("Error adding new address:", err);
    }
  };

  const handlePlaceOrder = async () => {
    if (selectedAddress === null) {
      console.error("No address selected");
      setIsAlertOpen(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/orders/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ shippingAddressIndex: selectedAddress }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      const data = await res.json();
      console.log("Order placed:", data.message);
      navigate("/payment");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <p className={styles.title}>My Order</p>
        <div className={styles.orderContainer}>
          <div className={styles.cartContainer}>
            <p className={styles.cartTitle}>Cart</p>
            <div>
              {productsList.items?.length > 0 ? (
                productsList.items.map((item, i) => (
                  <div key={`${item.product._id}-${i}`} className={styles.item}>
                    <p>{item.product.name}</p>
                    <p>
                      {item.quantity} x {item.product.price}€
                    </p>
                  </div>
                ))
              ) : (
                <p>Your cart is empty</p>
              )}
            </div>
            <p className={styles.totalPrice}>
              <span>Total:</span> {cartTotalPrice}€
            </p>
          </div>
          <div className={styles.addressesContainer}>
            <p className={styles.addressTitle}>Shipping address(es)</p>
            {addresses.length > 0 ? (
              <ul className={styles.addressList}>
                {addresses.map((address, i) => (
                  <li key={i} className={styles.addressItem}>
                    <label>
                      <input
                        type="radio"
                        name="selectedAddress"
                        value={i}
                        checked={selectedAddress === i}
                        onChange={() => setSelectedAddress(i)}
                      />
                      <div>
                        <p>{address.street}</p>
                        <p>
                          {address.postalCode} {address.city}
                        </p>
                        <p>{address.country}</p>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No saved addresses found.</p>
            )}
            <div className={styles.addBtn}>
              <button className={`btn ${styles.addressBtn}`} onClick={() => setIsNewAddressModalOpen(true)}>
                <AddHomeWorkTwoTone style={{ fontSize: 22 }} />
                Add new address
              </button>
            </div>
          </div>
        </div>
        <div className={styles.validateContainer}>
          <button
            className={`btn ${styles.validateBtn}`}
            onClick={handlePlaceOrder}
            disabled={productsList.items?.length === 0 || selectedAddress === null}
          >
            <CreditCardTwoTone style={{ fontSize: 22 }} />
            Go to payment
          </button>
        </div>
      </div>
      {isNewAddressModalOpen && (
        <UpdateAddressModal
          title="New address"
          onCloseModal={() => setIsNewAddressModalOpen(false)}
          btnTxt="Add new address"
          onPressBtn={handleAddNewAdress}
        />
      )}
      {isAlertOpen && (
        <Alert title="Alert" onClose={() => setIsAlertOpen(false)} content="You need to select a shipping address" color="red" />
      )}
    </div>
  );
}
