import { useEffect, useState } from "react";
import { useConversations, useMessages, useSendMessage } from "../hooks/useConversations";

export default function Chat() {
  const { data: conversations } = useConversations();
  const [active, setActive] = useState(null);
  const { data: messages } = useMessages(active?._id);
  const { mutate } = useSendMessage();
  const [text, setText] = useState("");

  const send = () => {
  if (!text.trim() || !active) return;

  mutate({ conversationId: active._id, text });
  setText("");
};
useEffect(() => {
  if (conversations?.length && !active) {
    setActive(conversations[0]);
  }
}, [conversations]);

  return (
    <div className="h-[90vh] flex bg-white rounded-2xl shadow overflow-hidden">

      {/* LEFT SIDEBAR */}
      <div className="w-1/3 border-r overflow-y-auto">
        {conversations?.map((c) => (
          <div
            key={c._id}
            onClick={() => setActive(c)}
            className={`p-4 cursor-pointer hover:bg-gray-100 ${
              active?._id === c._id ? "bg-gray-100" : ""
            }`}
          >
            <p className="font-medium">
              {c.participants.map(p => p.name).join(", ")}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {c.lastMessage}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT CHAT */}
      <div className="flex-1 flex flex-col">

        {/* MESSAGES */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages?.map((m) => (
            <div
              key={m._id}
              className={`max-w-xs p-2 rounded-xl text-sm ${
                m.senderId === active?.participants[0]._id
                  ? "bg-gray-200"
                  : "bg-black text-white ml-auto"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="p-3 border-t flex gap-2">
          <input
  disabled={!active}
  className="flex-1 border rounded-xl px-3 py-2 disabled:bg-gray-100"
/>

<button
  disabled={!active}
  className="bg-black text-white px-4 rounded-xl disabled:opacity-50"
>
  Send
</button>
        </div>
      </div>
    </div>
  );
}