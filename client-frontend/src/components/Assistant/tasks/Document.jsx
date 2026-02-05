// src/components/assistant/Documents.js
import React, { useState } from "react";
import { FileText, Upload, Download, Trash2, Search, User } from "lucide-react";

const Documents = () => {
  // Mock clients
  const clients = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Alice Smith" },
    { id: 3, name: "Robert Johnson" },
  ];

  // Mock documents per client
  const [documents, setDocuments] = useState({
    1: [
      { id: 1, name: "Contract_Agreement.pdf", type: "PDF", uploadedBy: "Attorney", date: "2025-09-25" },
      { id: 2, name: "CaseNotes.docx", type: "Word", uploadedBy: "Assistant", date: "2025-09-26" },
    ],
    2: [
      { id: 3, name: "Invoice_Sept.xlsx", type: "Excel", uploadedBy: "Assistant", date: "2025-09-28" },
    ],
    3: [],
  });

  const [selectedClient, setSelectedClient] = useState(clients[0].id);
  const [search, setSearch] = useState("");
  const [newDoc, setNewDoc] = useState(null);

  // Handle upload
  const handleUpload = () => {
    if (!newDoc) return;
    const newFile = {
      id: Date.now(),
      name: newDoc.name,
      type: newDoc.name.split(".").pop().toUpperCase(),
      uploadedBy: "Assistant",
      date: new Date().toISOString().split("T")[0],
    };

    setDocuments({
      ...documents,
      [selectedClient]: [...(documents[selectedClient] || []), newFile],
    });

    setNewDoc(null);
  };

  // Handle delete
  const handleDelete = (clientId, docId) => {
    setDocuments({
      ...documents,
      [clientId]: documents[clientId].filter((doc) => doc.id !== docId),
    });
  };

  // Filtered docs
  const filteredDocs = (documents[selectedClient] || []).filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[85vh] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Sidebar - Clients */}
      <div className="w-64 border-r border-slate-200 p-4 overflow-y-auto">
        <h3 className="text-base font-semibold mb-3 flex items-center">
          <User className="w-4 h-4 mr-2 text-blue-600" /> Clients
        </h3>
        <ul className="space-y-2">
          {clients.map((client) => (
            <li
              key={client.id}
              onClick={() => setSelectedClient(client.id)}
              className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium ${
                selectedClient === client.id
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              {client.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content - Documents */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Documents for {clients.find((c) => c.id === selectedClient)?.name}
          </h3>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              onChange={(e) => setNewDoc(e.target.files[0])}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-sm hover:bg-slate-200"
            >
              Choose File
            </label>
            <button
              onClick={handleUpload}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center"
            >
              <Upload className="w-4 h-4 mr-1" /> Upload
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left text-slate-700">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Type</th>
                <th className="p-3 border-b">Uploaded By</th>
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50">
                    <td className="p-3 border-b">{doc.name}</td>
                    <td className="p-3 border-b">{doc.type}</td>
                    <td className="p-3 border-b">{doc.uploadedBy}</td>
                    <td className="p-3 border-b">{doc.date}</td>
                    <td className="p-3 border-b text-right space-x-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(selectedClient, doc.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-slate-500 py-6">
                    No documents for this client
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documents;
