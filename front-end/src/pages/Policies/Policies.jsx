import React, { useState } from "react";
import "./Policiesdocuments.css";
import Navbar from "../../components/Navbar";

export default function PoliciesDocuments() {
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);

  const documents = [
    { id: 1, title: "Employee Handbook", version: "1.0", updatedAt: "2025-08-01", fileUrl: "/files/employee-handbook.pdf" },
    { id: 2, title: "IT Security Policy", version: "2.1", updatedAt: "2025-07-15", fileUrl: "/files/it-security-policy.pdf" },
    { id: 3, title: "Code of Conduct", version: "1.2", updatedAt: "2025-06-30", fileUrl: "/files/code-of-conduct.pdf" },
  ];

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleRowClick = (doc) => setSelectedDoc(doc);
  const closeModal = () => setSelectedDoc(null);

  return (
    <div className="anya-policies-page">
      <Navbar />

      {/* ✅ Page title below navbar */}
      <div className="anya-page-title-container">
        <h1 className="anya-page-title">Policies & Documents</h1>
      </div>

      {/* Search bar below the title */}
      <div className="anya-search-container">
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="anya-search-input"
        />
      </div>

      {/* Table below search */}
      <div className="anya-table-container">
        <table className="anya-documents-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Version</th>
              <th>Last Updated</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map(doc => (
              <tr
                key={doc.id}
                onClick={() => handleRowClick(doc)}
                className={selectedDoc?.id === doc.id ? "anya-selected-row" : ""}
              >
                <td>{doc.title}</td>
                <td>{doc.version}</td>
                <td>{doc.updatedAt}</td>
                <td>
                  <a href={doc.fileUrl} download className="anya-download-button">
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {selectedDoc && (
        <div className="anya-modal-overlay" onClick={closeModal}>
          <div className="anya-modal" onClick={e => e.stopPropagation()}>
            <h2>{selectedDoc.title}</h2>
            <p><strong>Version:</strong> {selectedDoc.version}</p>
            <p><strong>Last Updated:</strong> {selectedDoc.updatedAt}</p>
            <a href={selectedDoc.fileUrl} download className="anya-download-button">
              Download
            </a>
            <button className="anya-close-button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

