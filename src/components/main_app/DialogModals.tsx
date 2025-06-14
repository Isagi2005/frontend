import { Dialog, DialogTitle, Description } from "@headlessui/react";
import { toast } from "react-toastify";

const Dialogue = ({
  selectedId,
  setSelectedId,
  isOpen,
  setIsOpen,
  mutation,
}) => {
  const handleDelete = () => {
    console.log(selectedId);
    mutation.mutate(selectedId, {
      onSuccess: () => {
        toast.success("Suppression reussit !");
      },
      onError: () => {
        toast.error("Echec de la suppresion !");
      },
    });
    closeModal();
  };

  const closeModal = () => {
    setSelectedId(null);
    setIsOpen(false);
  };
  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="bg-white rounded-lg p-6 z-50 shadow-xl max-w-sm w-full mx-auto">
        <DialogTitle className="text-lg font-semibold">
          Confirmation
        </DialogTitle>
        <Description className="my-4">
          Voulez-vous vraiment supprimer ?
        </Description>
        <div className="flex justify-end gap-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Supprimer
          </button>
        </div>
      </div>
    </Dialog>
  );
};
export default Dialogue;
