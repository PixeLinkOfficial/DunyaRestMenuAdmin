import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function CategoryForm({ onClose, onSaved }) {
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titleEn.trim() || !titleAr.trim()) {
      return alert("Both languages required");
    }

    await addDoc(collection(db, "categories"), {
      titleEn,
      titleAr,
      createdAt: Date.now() // ✅ ensure categories have createdAt
    });

    onSaved();
  };

  return (
    <div className="modal">
      <div className="modal-body">
        <h3>Add category</h3>
        <form onSubmit={handleSubmit}>
          <label>Title (English)</label>
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
          />
          <label>Title (Arabic)</label>
          <input
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            dir="rtl"
          />
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
