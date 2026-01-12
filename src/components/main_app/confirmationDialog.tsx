import { Dialog, DialogTitle, Description } from "@headlessui/react";
import { toast } from "react-toastify";
import type { User } from "../../api/userApi";
import type { Dispatch, SetStateAction } from "react";
import type { UseMutationResult } from "@tanstack/react-query";

interface DialogueModalProps {
  description: string;
  selectedId: User | null;
  setSelectedId: Dispatch<SetStateAction<User | null>>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mutation: UseMutationResult<User, Error, User, unknown>;
}

const DialogueModal = ({
  description,
  selectedId,
  setSelectedId,
  isOpen,
  setIsOpen,
  mutation,
}: DialogueModalProps) => {
  const handleUpdate = () => {
    if (selectedId) {
      mutation.mutate(selectedId, {
        onSuccess: () => {
          if (selectedId.is_active === true) {
            toast.success(`Utilisateur activé !`);
          } else {
            toast.success(`Utilisateur desactivé !`);
          }
        },
        onError: () => {
          toast.error("Echec de votre requête !");
        },
      });
    }
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

        <Description className="my-4">{description}</Description>
        <div className="flex justify-end gap-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Confirmer
          </button>
        </div>
      </div>
    </Dialog>
  );
};
export default DialogueModal;
