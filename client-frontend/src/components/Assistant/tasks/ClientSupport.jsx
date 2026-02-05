// src/components/assistant/ClientSupport.js
import React, { useState } from "react";
import { MessageSquare, Send, User, CheckCircle, Clock } from "lucide-react";

const ClientSupport = () => {
  // Mock data for tickets
  const [tickets, setTickets] = useState([
    {
      id: 1,
      client: "John Doe",
      message: "I need an update on my divorce case timeline.",
      status: "open",
      replies: [],
    },
    {
      id: 2,
      client: "Priya Sharma",
      message: "Can you send me the invoice for last month?",
      status: "in-progress",
      replies: [
        { text: "Sure, I’ll prepare it by EOD.", by: "Assistant" }
      ],
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState("");

  // Send reply
  const handleSendReply = () => {
    if (!reply.trim() || !selectedTicket) return;

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === selectedTicket.id
        ? {
            ...ticket,
            replies: [...ticket.replies, { text: reply, by: "Assistant" }],
            status: "in-progress",
          }
        : ticket
    );

    setTickets(updatedTickets);
    setReply("");
  };

  // Mark ticket resolved
  const handleResolve = (ticketId) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: "resolved" } : ticket
      )
    );
    setSelectedTicket(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex h-[85vh]">
      {/* Ticket List */}
      <div className="w-1/3 border-r border-slate-200 overflow-y-auto">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Client Support Tickets</h3>
        </div>
        {tickets.map((ticket) => (
          <button
            key={ticket.id}
            onClick={() => setSelectedTicket(ticket)}
            className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition ${
              selectedTicket?.id === ticket.id ? "bg-slate-100" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-900">{ticket.client}</span>
              {ticket.status === "resolved" ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : ticket.status === "in-progress" ? (
                <Clock className="w-4 h-4 text-blue-600" />
              ) : (
                <MessageSquare className="w-4 h-4 text-yellow-600" />
              )}
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">{ticket.message}</p>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedTicket ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-slate-900">
                  {selectedTicket.client}
                </h3>
                <p className="text-sm text-slate-500">Ticket #{selectedTicket.id}</p>
              </div>
              {selectedTicket.status !== "resolved" && (
                <button
                  onClick={() => handleResolve(selectedTicket.id)}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  Mark Resolved
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex items-start space-x-2">
                <User className="w-5 h-5 text-slate-400 mt-1" />
                <div className="bg-slate-100 px-3 py-2 rounded-lg text-sm">
                  {selectedTicket.message}
                </div>
              </div>

              {selectedTicket.replies.map((reply, idx) => (
                <div
                  key={idx}
                  className="flex justify-end"
                >
                  <div className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm max-w-sm">
                    {reply.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            {selectedTicket.status !== "resolved" && (
              <div className="p-4 border-t border-slate-200 flex items-center space-x-2">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendReply}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Select a ticket to view conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSupport;
