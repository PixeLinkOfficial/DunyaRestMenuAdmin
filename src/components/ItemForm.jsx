import { useState } from "react";
import { db, storage } from "../firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../index.css";

export default function ItemForm({ categoryId, item, onClose, onSaved }) {
  const [nameEn, setNameEn] = useState(item?.nameEn || "");
  const [nameAr, setNameAr] = useState(item?.nameAr || "");
  const [nameKr, setNameKr] = useState(item?.nameKr || ""); // ✅ NEW Kurdish state
  const [price, setPrice] = useState(
    item ? item.price.replace(" IQD", "").replace(/,/g, "") : ""
  );
  const [file, setFile] = useState(null);

  const isEdit = !!item;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedPrice = Number(price).toLocaleString("en-US") + " IQD";

    let imageUrl = item?.image || "";
    if (file) {
      const storageRef = ref(storage, `items/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    const itemData = {
      nameEn,
      nameAr,
      nameKr, // ✅ include Kurdish name
      price: formattedPrice,
      image: imageUrl,
    };

    if (isEdit) {
      await updateDoc(doc(db, "categories", categoryId, "items", item.id), itemData);
    } else {
      await addDoc(collection(db, "categories", categoryId, "items"), {
        ...itemData,
        createdAt: Date.now(),
      });
    }

    onSaved();
  };

  return (
    <div className="modal">
      <div className="modal-body">
        <h3>{isEdit ? "Edit item" : "Add item"}</h3>
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
            Name (English)
          </label>
          <input
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />

          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
            Name (Arabic)
          </label>
          <input
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            dir="rtl"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />

          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
            Name (Kurdish)
          </label>
          <input
            value={nameKr}
            onChange={(e) => setNameKr(e.target.value)}
            dir="rtl" // ✅ Kurdish also RTL
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />

          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />

          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginBottom: "12px" }}
          />

          <div className="modal-actions">
            <button
              type="submit"
              style={{
                backgroundColor: "#4CAF50",
                color: "#fff",
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: "#F44336",
                color: "#fff",
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
