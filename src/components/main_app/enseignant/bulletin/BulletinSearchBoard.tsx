import React, { useState } from 'react';
import { useGetPeriode, useGetBulletin, useDeleteBulletin } from '../../../../hooks/useBulletin';
import { useGetClass } from '../../../../hooks/useClass';
import SearchBar from '../../SearchBar';
import Filter from '../../Filter';
import BulletinView from './BulletinView';
import BulletinForm from './BulletinForm';
import { Button, Dialog, DialogContent } from '@mui/material';
import { exportBulletinPDF } from './exportBulletinPDF';

const BulletinSearchBoard: React.FC = () => {
  const { data: periodes } = useGetPeriode();
  const { data: classes } = useGetClass();
  const { data: listBulletins } = useGetBulletin();
  const [search, setSearch] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBulletin, setSelectedBulletin] = useState<number|null>(null);
  const [editBulletin, setEditBulletin] = useState<number|null>(null);
  const [showForm, setShowForm] = useState(false);
  const deleteMutation = useDeleteBulletin();

  const filteredBulletins = Array.isArray(listBulletins)
    ? listBulletins.filter((bulletin) => {
        const matchesSearch = `${bulletin.eleve_nom || bulletin.eleve}`.toLowerCase().includes(search.toLowerCase());
        const matchesPeriod = selectedPeriod ? bulletin.periode_nom === selectedPeriod : true;
        const matchesClass = selectedClass ? bulletin.classe_nom === selectedClass : true;
        return matchesSearch && matchesPeriod && matchesClass;
      })
    : [];


  // Export PDF du bulletin avec évaluations, présentation professionnelle
const handleExportPDF = (bulletin: any) => {
  exportBulletinPDF(bulletin);
};

  return (
    <div>
      <div className='flex gap-4 mb-4'>
        <SearchBar search={search} setSearch={setSearch} />
        <Filter listData={periodes} selectedFilter={selectedPeriod} setSelectedFilter={setSelectedPeriod} label="Période" />
        <Filter listData={classes} selectedFilter={selectedClass} setSelectedFilter={setSelectedClass} label="Classe" />
      </div>
      {showForm && (
        <BulletinForm bulletinId={editBulletin} onClose={() => setShowForm(false)} />
      )}
      <table className="min-w-full border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Élève</th>
            <th className="border px-2 py-1">Classe</th>
            <th className="border px-2 py-1">Période</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBulletins.map((bulletin) => (
            <tr key={bulletin.id}>
              <td className="border px-2 py-1">{bulletin.eleve_nom || bulletin.eleve}</td>
              <td className="border px-2 py-1">{bulletin.classe_nom || bulletin.classeName}</td>
              <td className="border px-2 py-1">{bulletin.periode_nom || bulletin.periode}</td>
              <td className="border px-2 py-1 flex gap-2">
                <Button size="small" variant="outlined" onClick={() => setSelectedBulletin(bulletin.id)}>Voir</Button>
                {/* <Button size="small" color="secondary" variant="outlined" onClick={() => {setEditBulletin(bulletin.id); setShowForm(true);}}>Modifier</Button> */}
                <Button size="small" color="error" variant="outlined" onClick={() => deleteMutation.mutate(bulletin.id)}>Supprimer</Button>
                <Button size="small" color="success" variant="outlined" onClick={() => handleExportPDF(bulletin)}>Exporter PDF</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Affichage du détail bulletin dans une modal */}
      <Dialog open={!!selectedBulletin} onClose={() => setSelectedBulletin(null)} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0 }}>
          {selectedBulletin && (
            <BulletinView bulletinId={selectedBulletin} onClose={() => setSelectedBulletin(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulletinSearchBoard;