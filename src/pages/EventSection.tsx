import { useState, FormEvent } from "react";
import { useAddEvent } from "../hooks/useEvent";
import Events from "../components/EvenementsScroll";
import { UseLogout } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

function EventSection() {
  const nav = useNavigate();
  const addEvent = useAddEvent();
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [datedebut, setdateDebut] = useState("");
  const [datefin, setdateFin] = useState("");

  // Fonction pour gérer l'ajout d'une image
  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleLogout = async () => {
    const success = await UseLogout();
    if (success) {
      nav("/login");
    }
  };

  // Fonction pour gérer la soumission du formulaire
  const handleChange = async (e: FormEvent) => {
    e.preventDefault();

    // Création de l'objet event à partir des données du formulaire
    const event = {
      titre,
      description,
      image,
      datedebut,
      datefin,
    };

    // Appel à l'API pour ajouter l'événement
    try {
      await addEvent.mutateAsync(event); // Envoie directement l'objet event
      console.log("Événement ajouté !");
    } catch (error) {
      console.log("Erreur lors de l'ajout de l'événement:", error.message);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <form className="bg-slate-500" onSubmit={handleChange}>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Titre"
        />
        <br />
        <input type="file" onChange={handleImage} />
        <br />
        <input
          type="date"
          value={datedebut}
          onChange={(e) => setdateDebut(e.target.value)}
        />
        <br />
        <input
          type="date"
          value={datefin}
          onChange={(e) => setdateFin(e.target.value)}
        />
        <br />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <br />
        <button type="submit">Ajouter</button>
      </form>
      <Events />
    </div>
  );
}

export default EventSection;
