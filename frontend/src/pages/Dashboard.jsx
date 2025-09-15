import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  api.get('contrats/')
    .then(res => {
      console.log('Contrats API:', res.data);  // 👈 pour voir ce que renvoie le backend
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setContracts(data || []);
    })
    .catch(err => {
      console.error('Erreur API contrats:', err);
      setContracts([]);
    })
    .finally(() => setLoading(false));
}, []);



  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Contrats</h2>
      {loading ? <div>Chargement...</div> : (
        <table className="table-auto w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">ID</th>
              <th className="p-2">Employé</th>
              <th className="p-2">Type</th>
              <th className="p-2">Début</th>
              <th className="p-2">Fin</th>
              <th className="p-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.id}</td>
                <td className="p-2">{c.employe}</td>
                <td className="p-2">{c.type}</td>
                <td className="p-2">{c.date_debut}</td>
                <td className="p-2">{c.date_fin ?? '-'}</td>
                <td className="p-2">{c.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
