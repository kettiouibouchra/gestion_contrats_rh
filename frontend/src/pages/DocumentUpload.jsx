import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function DocumentUpload() {
  const [nom, setNom] = useState('');
  const [type, setType] = useState('AUTRE');
  const [file, setFile] = useState(null);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!file) { setErr('Choisis un fichier'); return; }
    const fd = new FormData();
    fd.append('nom', nom || file.name);
    fd.append('type', type);
    fd.append('fichier', file);
    try {
      await api.post('documents/', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      navigate('/documents');
    } catch (err) {
      setErr('Erreur upload: ' + (err.response?.data || err.message));
    }
  };

  return (
    <form onSubmit={submit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-3">Uploader un document</h2>
      <input value={nom} onChange={e=>setNom(e.target.value)} placeholder="Nom du document" className="w-full p-2 border mb-2" />
      <select value={type} onChange={e=>setType(e.target.value)} className="w-full p-2 mb-2">
        <option value="CV">CV</option>
        <option value="ATTESTATION">Attestation</option>
        <option value="AUTRE">Autre</option>
      </select>
      <input type="file" onChange={e=>setFile(e.target.files[0])} className="mb-2" />
      <button className="bg-green-600 text-white py-2 px-4 rounded">Uploader</button>
      {err && <div className="text-red-600 mt-2">{err}</div>}
    </form>
  );
}
