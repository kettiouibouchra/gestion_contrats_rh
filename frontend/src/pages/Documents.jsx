import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Documents() {
  const [docs, setDocs] = useState([]);
  useEffect(()=> {
    api.get('documents/')
      .then(r => setDocs(r.data.results || r.data))
      .catch(console.error);
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Documents</h2>
      <ul>
        {docs.map(d => (
          <li key={d.id} className="mb-2">
            <a href={d.fichier} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              {d.nom || d.fichier.split('/').pop()}
            </a>
            <span className="ml-3 text-gray-600">par {d.proprietaire}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
