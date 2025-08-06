import ModelsDropdown from "../../features/models-dropdown/ModelsDropdown";
import ChatWindow from "../../features/chat/ChatWindow";

function Playground() {
  return (
    <section className="flex flex-col w-full h-full gap-[10px]">
      <ModelsDropdown />
      <hr className="border-gray-600 border-1"></hr>
      <ChatWindow />
    </section>
  );
}

export default Playground;
