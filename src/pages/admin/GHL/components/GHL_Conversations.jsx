import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGhlConversations, fetchMessages } from '@/redux/actions/ghl.actions';
import ghlService from '@/services/ghl.service';
import CallDialer from './CallDialer';
import {
  Card,
  CardBody,
  Input,
  Typography,
  Button,
} from '@material-tailwind/react';
import { MagnifyingGlassIcon, PhoneIcon } from '@heroicons/react/24/outline';

const DEFAULT_LOCATION_ID = '1GUw2okV7aCJ4cJdBU8m';

const GHL_Conversations = ({ onClose, initialContactId = '' }) => {
  const dispatch = useDispatch();
  const ghlState = useSelector(
    (state) => state?.ghl ?? { conversations: [], messages: {}, error: null }
  );
  const conversations = ghlState?.conversations ?? [];
  const messagesByConversation = ghlState?.messages ?? {};
  const error = ghlState?.error ?? null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showCallDialer, setShowCallDialer] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchGhlConversations(DEFAULT_LOCATION_ID));
  }, [dispatch]);

  // When conversations load OR initialContactId changes, auto-select conversation for that contact
  useEffect(() => {
    if (!initialContactId || !conversations.length) return;

    const convForContact = conversations.find(
      (c) => c.contactId === initialContactId
    );

    if (convForContact && convForContact.id !== selectedConversationId) {
      setSelectedConversationId(convForContact.id);
      dispatch(fetchMessages(convForContact.id));
    }
  }, [initialContactId, conversations, dispatch, selectedConversationId]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (conv) =>
        conv.contactName?.toLowerCase().includes(query) ||
        conv.email?.toLowerCase().includes(query) ||
        conv.phone?.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  const sortedConversations = useMemo(() => {
    return [...filteredConversations].sort(
      (a, b) => (b.lastMessageDate || 0) - (a.lastMessageDate || 0)
    );
  }, [filteredConversations]);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const onSelectConversation = (conv) => {
    setSelectedConversationId(conv.id);
    dispatch(fetchMessages(conv.id));
  };

  const convMessagesEntry = selectedConversationId
    ? messagesByConversation[selectedConversationId] ?? null
    : null;

  const messages = Array.isArray(convMessagesEntry)
    ? convMessagesEntry
    : convMessagesEntry?.messages ?? [];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, selectedConversationId]);

  const onSend = async () => {
    if (!selectedConversationId || !selectedConversation?.id) return;
    const text = (messageText || '').trim();
    if (!text) return;

    try {
      let messageType = 'SMS';

      const result = await ghlService.sendMessage(
        selectedConversationId,
        text,
        selectedConversation.contactId,
        messageType,
        'pending'
      );
      setMessageText('');
      dispatch(fetchMessages(selectedConversationId));
    } catch (err) {
      console.error('Failed to send message', err);
      console.error('Error details:', err.response?.data);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative mx-4 w-full max-w-6xl max-h-[90vh] rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-2xl overflow-hidden flex flex-col">
        {/* Close button */}
        <button
          type="button"
          className="absolute top-3 right-4 text-xl text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
          onClick={onClose}
        >
          ×
        </button>

        <div className="flex flex-col h-full p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Header */}
          <div>
            <Typography
              variant="h4"
              className="font-semibold text-light-text dark:text-dark-text text-lg sm:text-2xl"
            >
              GHL Conversations
            </Typography>
            <Typography className="text-xs sm:text-sm text-light-muted dark:text-dark-muted">
              WhatsApp, SMS, and Call conversations from your GoHighLevel account.
            </Typography>
          </div>

          {error && (
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3 sm:p-4 text-xs sm:text-sm text-primary">
              {error}
            </div>
          )}

          <div className="flex min-h-0 flex-col md:flex-row gap-4 sm:gap-6">
            
            {/* RIGHT: Messages */}
            <Card className="w-full shadow-sm border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface h-full flex-1">
              <CardBody className="flex h-[500px] flex-col p-3 sm:p-4">
                {selectedConversation ? (
                  <>
                    <div className="mb-3 sm:mb-4 border-b border-light-border dark:border-dark-border pb-3 sm:pb-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <Typography className="text-sm sm:text-base font-semibold text-light-text dark:text-dark-text">
                              {selectedConversation.contactName || 'Unknown'}
                            </Typography>
                            <Typography className="text-xs sm:text-sm text-light-muted dark:text-dark-muted">
                              {selectedConversation.email}
                            </Typography>
                            <Typography className="text-xs sm:text-sm text-light-muted dark:text-dark-muted">
                              {selectedConversation.phone}
                            </Typography>
                          </div>
                        </div>
                        <div className="text-right">
                          <Typography className="text-[10px] sm:text-[11px] uppercase font-semibold tracking-wide text-light-muted dark:text-dark-muted">
                            Last Activity
                          </Typography>
                          <Typography className="text-xs sm:text-sm text-light-text dark:text-dark-text">
                            {formatTime(selectedConversation.lastMessageDate)}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    {/* Messages list */}
                    <div className="flex-1 overflow-y-auto space-y-3 px-1">
                      {messages.length === 0 ? (
                        <div className="py-8 text-center text-xs sm:text-sm text-light-muted dark:text-dark-muted">
                          No messages for this conversation
                        </div>
                      ) : (
                        [...messages]
                          .sort((a, b) => {
                            const dateA = new Date(
                              a.dateAdded ?? a.createdAt ?? a.date ?? 0
                            ).getTime();
                            const dateB = new Date(
                              b.dateAdded ?? b.createdAt ?? b.date ?? 0
                            ).getTime();
                            return dateA - dateB;
                          })
                          .map((msg, idx) => (
                            <div
                              key={msg.id ?? idx}
                              className={`max-w-[80%] rounded-md p-2.5 sm:p-3 text-xs sm:text-sm ${
                                msg.direction === 'inbound'
                                  ? 'self-start bg-light-background dark:bg-dark-background'
                                  : 'self-end ml-auto bg-primary/10 text-light-text dark:text-dark-text'
                              }`}
                            >
                              <div className="text-light-text dark:text-dark-text">
                                {msg.text ?? msg.body ?? msg.message ?? '-'}
                              </div>
                              <div className="mt-1 text-[10px] text-light-muted dark:text-dark-muted">
                                {new Date(
                                  msg.dateAdded ??
                                    msg.createdAt ??
                                    msg.date ??
                                    Date.now()
                                ).toLocaleString()}
                              </div>
                            </div>
                          ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input bar */}
                    <div className="mt-3 sm:mt-4 border-t border-light-border dark:border-dark-border pt-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 text-sm text-light-text dark:text-dark-text"
                          containerProps={{ className: 'w-full' }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              onSend();
                            }
                          }}
                        />
                        <Button
                          onClick={onSend}
                          className="mt-1 w-full sm:mt-0 sm:w-auto bg-primary text-white normal-case text-sm px-4 py-2 rounded-lg hover:bg-primary/90 shadow-sm"
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-light-muted dark:text-dark-muted text-sm">
                    <Typography>Select a conversation to view details</Typography>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* CallDialer Modal */}
          {showCallDialer && selectedConversation && (
            <CallDialer
              defaultPhoneNumber={selectedConversation.phone || ''}
              contactId={selectedConversation.contactId || ''}
              locationId={DEFAULT_LOCATION_ID}
              onClose={() => setShowCallDialer(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GHL_Conversations;
