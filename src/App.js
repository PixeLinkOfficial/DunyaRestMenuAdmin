import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
  where
} from "firebase/firestore";
import "./index.css";
import restImg from "./assets/others/restimg.png";
import CardImage from "./components/CardImage";
import CategoryForm from "./components/CategoryForm";
import ItemForm from "./components/ItemForm";


export default function App({ lang, setLang, isAdmin = false }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [showCatForm, setShowCatForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [addingItem, setAddingItem] = useState(false);

  // Fetch categories
// Categories: only docs with createdAt > 0, ordered oldest → newest
const fetchCategories = async () => {
  const q = query(
    collection(db, "categories"),
    where("createdAt", ">", 0),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  const cats = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  setCategories(cats);
  if (cats.length > 0 && !category) setCategory(cats[0].id);
};

useEffect(() => {
  fetchCategories();
}, []);


// Items: only docs with createdAt > 0, ordered oldest → newest
const fetchItems = async () => {
  if (!category) return;

  const q = query(
    collection(db, "categories", category, "items"),
    where("createdAt", ">", 0),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  setItems(list);
};

useEffect(() => {
  fetchItems();
}, [category]);


  // Delete category (and its items)
  const deleteCategory = async (catId) => {
    if (!window.confirm("Delete this category and all its items?")) return;
    const itemsSnap = await getDocs(collection(db, "categories", catId, "items"));
    await Promise.all(
      itemsSnap.docs.map((d) =>
        deleteDoc(doc(db, "categories", catId, "items", d.id))
      )
    );
    await deleteDoc(doc(db, "categories", catId));
    await fetchCategories();
    setCategory(null);
    setItems([]);
  };

  // Delete item
  const deleteItem = async (itemId) => {
    if (!window.confirm("Delete this item?")) return;
    await deleteDoc(doc(db, "categories", category, "items", itemId));
    await fetchItems();
  };

  return (
  <div className={`app ${lang}`} dir={lang === "ar" || lang === "kr" ? "rtl" : "ltr"}>
    {/* Header + Lang Switch */}
    <div className="header">
      <div className={`lang-switch ${lang}`}>
        <div
          className={`lang-option ${lang === "en" ? "active" : ""}`}
          onClick={() => setLang("en")}
        >
          <img src="https://flagcdn.com/gb.svg" alt="English" />
          <span>EN</span>
        </div>
        <div
          className={`lang-option ${lang === "ar" ? "active" : ""}`}
          onClick={() => setLang("ar")}
        >
          <img src="https://flagcdn.com/sa.svg" alt="Arabic" />
          <span>AR</span>
        </div>
        <div
          className={`lang-option ${lang === "kr" ? "active" : ""}`}
          onClick={() => setLang("kr")}
        >
          <img src="https://flagcdn.com/iq.svg" alt="Kurdish" />
          <span>KR</span>
        </div>
        <div className="lang-thumb" />
      </div>
    </div>

    <div className="content">
      {/* Hero Image */}
      <div className="hero-image">
        <img src={restImg} alt="Restaurant" />
      </div>

      {/* Tabs from Firebase */}
      <div className="tabs">
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginRight: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <button
              onClick={() => setCategory(cat.id)}
              style={{
                backgroundColor: category === cat.id ? "#3b6cb7" : "#ffffff",
                color: category === cat.id ? "#fff" : "#333",
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {lang === "en"
                ? cat.titleEn
                : lang === "ar"
                ? cat.titleAr
                : cat.titleKr}
            </button>

            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCategory(cat.id);
                }}
                style={{
                  backgroundColor: "#F44336",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 8px",
                  cursor: "pointer",
                }}
              >
                X
              </button>
            )}
          </div>
        ))}
        {isAdmin && (
          <button
            onClick={() => setShowCatForm(true)}
            style={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginLeft: "10px",
              fontWeight: "bold",
            }}
          >
            + Add category
          </button>
        )}
      </div>

      {showCatForm && (
        <CategoryForm
          onClose={() => setShowCatForm(false)}
          onSaved={async () => {
            setShowCatForm(false);
            await fetchCategories();
          }}
        />
      )}

      {/* Active category title */}
      {category && (
        <p
          style={{
            fontSize: "20px",
            fontWeight: "600",
            marginTop: "20px",
            color: "#333",
          }}
        >
          {lang === "en"
            ? categories.find((c) => c.id === category)?.titleEn
            : lang === "ar"
            ? categories.find((c) => c.id === category)?.titleAr
            : categories.find((c) => c.id === category)?.titleKr}
        </p>
      )}

      {/* Items from Firebase */}
      <div className="list">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "12px",
              marginBottom: "12px",
              cursor: "pointer",
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ fontWeight: "600", marginBottom: "4px" }}>
                {lang === "en"
                  ? item.nameEn
                  : lang === "ar"
                  ? item.nameAr
                  : item.nameKr}
              </p>
              <p style={{ color: "#555" }}>{item.price}</p>
              {isAdmin && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{ marginTop: "10px" }}
                >
                  <button
                    onClick={() => setEditingItem(item)}
                    style={{
                      backgroundColor: "#FFC107",
                      color: "#000",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "6px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    style={{
                      backgroundColor: "#F44336",
                      color: "#fff",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {item.image && <CardImage src={item.image} alt={item.nameEn} />}
          </div>
        ))}

        {isAdmin && (
          <div>
            <button
              onClick={() => setAddingItem(true)}
              style={{
                backgroundColor: "#3b6cb7",
                color: "#fff",
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "10px",
                fontWeight: "bold",
              }}
            >
              + Add item
            </button>
          </div>
        )}

        {addingItem && (
          <ItemForm
            categoryId={category}
            onClose={() => setAddingItem(false)}
            onSaved={async () => {
              setAddingItem(false);
              await fetchItems();
            }}
          />
        )}
        {editingItem && (
          <ItemForm
            categoryId={category}
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onSaved={async () => {
              setEditingItem(null);
              await fetchItems();
            }}
          />
        )}
      </div>
    </div>

   {/* Popup (view only) */}
{selectedItem && (
  <div
    onClick={() => setSelectedItem(null)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        maxWidth: "500px",
        width: "90%",
        padding: "20px",
        position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <button
        onClick={() => setSelectedItem(null)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "#F44336",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        ✕
      </button>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <img
          src={selectedItem.image}
          alt={selectedItem.nameEn}
          style={{
            maxWidth: "100%",
            borderRadius: "6px",
          }}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ marginBottom: "8px", color: "#333" }}>
          {lang === "en"
            ? selectedItem.nameEn
            : lang === "ar"
            ? selectedItem.nameAr
            : selectedItem.nameKr}
        </h2>
        <p style={{ fontSize: "18px", fontWeight: "600", color: "#555" }}>
          {selectedItem.price}
        </p>
      </div>
    </div>
  </div>
)}
</div>
);
}
