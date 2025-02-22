import { useEffect, useState } from "react";
import styles from "../styles/profile.module.css";
import { ChangeCircleTwoTone, DeleteForeverTwoTone, AddHomeWorkTwoTone } from "@mui/icons-material";
import UpdateAddressModal from "../components/UpdateAddressModal";
import ConfirmationModal from "../components/ConfirmationModal";

export default function Profile() {
  const [infos, setInfos] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newPostalCode, setNewPostalCode] = useState("");
  const [newCountry, setNewCountry] = useState("");

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) {
          console.error("Failed to fetch user data:", res.status);
          throw new Error("User not found or unauthorized.");
        }
        const profileData = await res.json();
        setInfos(profileData.user);
      } catch (err) {
        console.error("Error fetching profile infos:", err);
      }
    };
    getProfileData();
  }, []);

  const handleClickUpdate = (index) => {
    setSelectedIndex(index);
    setSelectedAddress(infos.addresses[index]);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateAddress = async (updatedAddress) => {
    if (selectedIndex === null) return;

    const payload = {
      index: selectedIndex,
      street: updatedAddress.street,
      city: updatedAddress.city,
      postalCode: updatedAddress.postalCode,
      country: updatedAddress.country,
    };

    try {
      const res = await fetch("http://localhost:3000/users/updateAddress/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      const data = await res.json();
      console.log(data.message);

      setInfos((prevInfos) => {
        const updatedAddresses = [...prevInfos.addresses];
        updatedAddresses[selectedIndex] = updatedAddress;
        return { ...prevInfos, addresses: updatedAddresses };
      });
      setIsUpdateModalOpen(false);
    } catch (err) {
      console.error("Error updating address:", err);
    }
  };

  const handleRemoveAddress = async () => {
    try {
      const res = await fetch("http://localhost:3000/users/removeAddress/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ index: selectedIndex }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      const data = await res.json();
      console.log(data.message);

      setInfos((prevInfos) => ({
        ...prevInfos,
        addresses: prevInfos.addresses.filter((_, i) => i !== selectedIndex),
      }));
      setIsConfirmModalOpen(false);
      setSelectedIndex(null);
    } catch (err) {
      console.error("Error removing address:", err);
    }
  };

  const openConfirmModal = (index) => {
    setSelectedIndex(index);
    setIsConfirmModalOpen(true);
  };

  const handleAddNewAdress = async () => {
    try {
      const res = await fetch("http://localhost:3000/users/addAddress/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ street: newStreet, city: newCity, postalCode: newPostalCode, country: newCountry }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      const data = await res.json();
      console.log(data.message);

      setInfos((prevInfos) => ({
        ...prevInfos,
        addresses: [
          ...prevInfos.addresses,
          {
            street: newStreet,
            city: newCity,
            postalCode: newPostalCode,
            country: newCountry,
          },
        ],
      }));

      setNewStreet("");
      setNewCity("");
      setNewPostalCode("");
      setNewCountry("");
    } catch (err) {
      console.error("Error adding new address:", err);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h2>My Profile</h2>
        {infos && (
          <>
            <div>
              <p>
                <span className={styles.label}>Name:</span> {infos.firstname} {infos.lastname}
              </p>
            </div>
            <div>
              <p>
                <span className={styles.label}>Email:</span> {infos.email}
              </p>
            </div>
            <div>
              <p>
                <span className={styles.label}>Addresses:</span>
              </p>
              {infos.addresses.map((address, i) => (
                <div key={i} className={styles.addressContainer}>
                  <div className={styles.textContainer}>
                    <p className={styles.addressName}>Address n°{i + 1}</p>
                    <p>
                      <span className={styles.addressInfos}>Street:</span> {address.street}
                    </p>
                    <p>
                      <span className={styles.addressInfos}>City:</span> {address.city}
                    </p>
                    <p>
                      <span className={styles.addressInfos}>Postal Code:</span> {address.postalCode}
                    </p>
                    <p>
                      <span className={styles.addressInfos}>Country:</span> {address.country}
                    </p>
                  </div>
                  <div className={styles.btnContainer}>
                    <button className={`btn ${styles.addressBtn}`} onClick={() => handleClickUpdate(i)}>
                      <ChangeCircleTwoTone style={{ fontSize: 22 }} />
                      Update
                    </button>
                    <button className={`btn ${styles.addressBtn}`} onClick={() => openConfirmModal(i)}>
                      <DeleteForeverTwoTone style={{ fontSize: 22, color: "red" }} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p>
              <span className={styles.label}>New address:</span>
            </p>
            <div className={styles.addSection}>
              <div className={styles.form}>
                <div className={styles.inputContainer}>
                  <p>Street:</p>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Enter number & street name"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                  />
                  <p>City:</p>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Enter city name"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                  />
                  <p>Postal Code:</p>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Enter postal code"
                    value={newPostalCode}
                    onChange={(e) => setNewPostalCode(e.target.value)}
                  />
                  <p>Country:</p>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Enter country"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                  />
                </div>
                <div className={`${styles.btnContainer} ${styles.addBtn}`}>
                  <button className={`btn ${styles.addressBtn}`} onClick={handleAddNewAdress}>
                    <AddHomeWorkTwoTone style={{ fontSize: 22 }} />
                    Add new address
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {isConfirmModalOpen && (
        <ConfirmationModal
          title="Confirmation"
          content="Are you sure to delete this address?"
          btnTxt="Yes"
          onPressBtn={handleRemoveAddress}
          onCloseModal={() => setIsConfirmModalOpen(false)}
        />
      )}
      {isUpdateModalOpen && (
        <UpdateAddressModal
          title="Update address"
          onCloseModal={() => setIsUpdateModalOpen(false)}
          btnTxt="Confirm address update"
          onPressBtn={handleUpdateAddress}
          address={selectedAddress}
        />
      )}
    </div>
  );
}
