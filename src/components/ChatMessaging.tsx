import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  X, 
  Search,
  User,
  Phone,
  Video,
  MoreVertical,
  Archive
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { mockConversations, mockMessages, Conversation, Message } from '../data/messages';

interface ChatMessagingProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatMessaging({ isOpen, onClose }: ChatMessagingProps) {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeConversation]);

  const filteredConversations = conversations.filter(conv =>
    conv.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = activeConversation
    ? messages.filter(m => m.conversationId === activeConversation.id)
    : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message: Message = {
      id: `MSG-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: 'buyer-1',
      senderName: 'You',
      senderType: 'buyer',
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
    };

    setMessages([...messages, message]);
    
    // Update conversation last message
    setConversations(conversations.map(conv =>
      conv.id === activeConversation.id
        ? { ...conv, lastMessage: newMessage, lastMessageTime: message.timestamp }
        : conv
    ));

    setNewMessage('');
  };

  const markAsRead = (conversationId: string) => {
    setConversations(conversations.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed right-0 top-0 bottom-0 w-full md:w-[800px] bg-white shadow-2xl z-50 flex"
      >
        {/* Conversations List */}
        <div className="w-80 border-r flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <h2>Messages</h2>
                {totalUnread > 0 && (
                  <Badge variant="destructive" className="rounded-full">
                    {totalUnread}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversations */}
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveConversation(conv);
                    markAsRead(conv.id);
                  }}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    activeConversation?.id === conv.id ? 'bg-green-50 border-l-4 border-green-600' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {conv.farmerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="font-medium truncate">{conv.farmName}</div>
                        {conv.unreadCount > 0 && (
                          <Badge variant="destructive" className="rounded-full text-xs">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mb-1">{conv.farmerName}</div>
                      <div className="text-sm text-gray-500 truncate">{conv.lastMessage}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(conv.lastMessageTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {filteredConversations.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>No conversations found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {activeConversation.farmerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{activeConversation.farmName}</h3>
                      <div className="text-sm text-gray-600">{activeConversation.farmerName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {currentMessages.map((msg, index) => {
                    const isOwn = msg.senderType === 'buyer';
                    const showAvatar = index === 0 || currentMessages[index - 1].senderType !== msg.senderType;

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                      >
                        {showAvatar ? (
                          <Avatar className="flex-shrink-0">
                            <AvatarFallback className={isOwn ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}>
                              {msg.senderName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-10"></div>
                        )}
                        <div className={`flex-1 max-w-md ${isOwn ? 'flex justify-end' : ''}`}>
                          {showAvatar && (
                            <div className={`text-xs text-gray-600 mb-1 ${isOwn ? 'text-right' : ''}`}>
                              {msg.senderName}
                            </div>
                          )}
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              isOwn
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {msg.message}
                          </div>
                          <div className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : ''}`}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
