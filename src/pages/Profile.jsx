import { useEffect, useState } from "react";
import styles from "../styles/profile.module.css";

export default function Profile() {
  const [infos, setInfos] = useState();

  useEffect(() => {
    async function getProfileData() {
      try {
        const profileRes = await fetch("http://localhost:3000/users/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!profileRes.ok) {
          console.error("Failed to fetch user data:", profileRes.status);
          throw new Error("User not found or unauthorized.");
        }
        const profileData = await profileRes.json();
        setInfos(profileData);
      } catch (err) {
        console.error(err);
      }
    }
    getProfileData();
  }, []);
  console.log(infos);

  return <div className={styles.main}>Profile Page</div>;
}
