import ChatContainer from "../../chat/ChatContainer"
import { useGetParentPedagogique } from "../../../hooks/useDashboard"
import { GetUser } from "../../../hooks/useUser"


export default function ParentChat() {
  // On récupère les enfants du parent pour obtenir les titulaires
  const { data: enfants } = useGetParentPedagogique()
  const { data: user } = GetUser()

  // On passe une prop spéciale à ChatContainer pour activer le mode parent
  // (Il faudra adapter ConversationList pour supporter ce filtrage)
  return (
    <div className="max-w-3xl mx-auto my-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Messagerie Parent</h2>
      <ChatContainer mode="parent" enfants={enfants} user={user} />
      <div className="text-gray-500 mt-4 text-sm">
        Vous pouvez discuter avec les titulaires de vos enfants et les groupes dont vous êtes membre. <br />
        <b>Vous ne pouvez pas créer de groupe ni de nouvelle discussion.</b>
      </div>
    </div>
  )
}
