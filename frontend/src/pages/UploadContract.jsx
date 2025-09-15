import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function UploadContract() {
  const [type, setType] = useState('CDI');
  const [employeId, setEmployeId] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [file, setFile] = useState(null);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!file) { setErr('Choisis un fichier'); return; }
    const fd = new FormData();
    fd.append('type', type);
    fd.append('employe_id', employeId);
    fd.append('date_debut', dateDebut);
    if (dateFin) fd.append('date_fin', dateFin);
    fd.append('fichier', file);

    try {
      await api.post('contrats/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (error) {
        console.error("Erreur backend:", error.response?.data);
        setErr('Erreur upload : ' + JSON.stringify(error.response?.data));
    }

  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Créer un contrat</h2>
      <form onSubmit={submit}>
        <input value={employeId} onChange={e=>setEmployeId(e.target.value)} placeholder="Employe id" className="w-full p-2 border mb-2" />
        <select value={type} onChange={e=>setType(e.target.value)} className="w-full p-2 border mb-2">
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="STAGE">Stage</option>
        </select>
        <input type="date" value={dateDebut} onChange={e=>setDateDebut(e.target.value)} className="w-full p-2 border mb-2" />
        <input type="date" value={dateFin} onChange={e=>setDateFin(e.target.value)} className="w-full p-2 border mb-2" />
        <input type="file" onChange={e=>setFile(e.target.files[0])} className="w-full p-2 mb-2" />
        <button className="bg-blue-600 text-white py-2 px-4 rounded">Créer</button>
        {err && <div className="text-red-600 mt-2">{err}</div>}
      </form>
    </div>
  );
}
