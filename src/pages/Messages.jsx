import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { ArrowLeft, Send, Search, User } from 'lucide-react'
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, updateDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'

export default function Messages() {
  const { userData } = useAuth()
  const { users } = useData()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!userData) return

    let unsubscribe

    try {
      // Загрузить разговоры
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userData.id),
        orderBy('lastMessageTime', 'desc')
      )

      unsubscribe = onSnapshot(q, (snapshot) => {
        const convos = snapshot.docs.map(doc => {
          const data = doc.data()
          const otherUserId = data.participants.find(id => id !== userData.id)
          const otherUser = users.find(u => u.id === otherUserId)
          return {
            id: doc.id,
            ...data,
            otherUser
          }
        })
        setConversations(convos)
      }, (error) => {
        console.error('Ошибка загрузки разговоров:', error)
        // Fallback без сортировки
        if (error.code === 'failed-precondition') {
          const fallbackQ = query(
            collection(db, 'conversations'),
            where('participants', 'array-contains', userData.id)
          )
          unsubscribe = onSnapshot(fallbackQ, (snapshot) => {
            const convos = snapshot.docs.map(doc => {
              const data = doc.data()
              const otherUserId = data.participants.find(id => id !== userData.id)
              const otherUser = users.find(u => u.id === otherUserId)
              return {
                id: doc.id,
                ...data,
                otherUser
              }
            }).sort((a, b) => {
              const aTime = a.lastMessageTime?.toDate?.() || new Date(a.createdAt || 0)
              const bTime = b.lastMessageTime?.toDate?.() || new Date(b.createdAt || 0)
              return bTime - aTime
            })
            setConversations(convos)
          })
        }
      })
    } catch (error) {
      console.error('Ошибка инициализации разговоров:', error)
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [userData, users])

  useEffect(() => {
    if (!selectedUser || !userData) return

    // Найти conversationId
    const conversation = conversations.find(c => 
      c.participants.includes(selectedUser.id)
    )

    if (!conversation) {
      setMessages([])
      return
    }

    let unsubscribe

    try {
      // Загрузить сообщения
      const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversation.id),
        orderBy('timestamp', 'asc')
      )

      unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setMessages(msgs)
      }, (error) => {
        console.error('Ошибка загрузки сообщений:', error)
        if (error.code === 'failed-precondition') {
          // Fallback без сортировки
          const fallbackQ = query(
            collection(db, 'messages'),
            where('conversationId', '==', conversation.id)
          )
          unsubscribe = onSnapshot(fallbackQ, (snapshot) => {
            const msgs = snapshot.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .sort((a, b) => {
                const aTime = a.timestamp?.toDate?.() || new Date(a.createdAt || 0)
                const bTime = b.timestamp?.toDate?.() || new Date(b.createdAt || 0)
                return aTime - bTime
              })
            setMessages(msgs)
          })
        }
      })
    } catch (error) {
      console.error('Ошибка инициализации сообщений:', error)
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [selectedUser, userData, conversations])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !userData) return

    try {
      // Найти или создать разговор
      let conversationId = conversations.find(c => 
        c.participants.includes(selectedUser.id)
      )?.id

      if (!conversationId) {
        // Создать новый разговор
        const newConv = await addDoc(collection(db, 'conversations'), {
          participants: [userData.id, selectedUser.id],
          lastMessage: newMessage,
          lastMessageTime: serverTimestamp(),
          createdAt: serverTimestamp()
        })
        conversationId = newConv.id
      }

      // Отправить сообщение
      await addDoc(collection(db, 'messages'), {
        conversationId,
        participants: [userData.id, selectedUser.id],
        senderId: userData.id,
        text: newMessage,
        timestamp: serverTimestamp(),
        read: false,
        createdAt: new Date().toISOString()
      })

      // Обновить разговор
      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: newMessage,
        lastMessageTime: serverTimestamp()
      })

      setNewMessage('')
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error)
    }
  }

  const filteredUsers = users.filter(user => 
    user.id !== userData?.id &&
    (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="h-screen bg-black text-white flex">
      {/* Список разговоров */}
      <div className="w-1/3 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-pink-500/20 rounded-full transition-smooth"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold gradient-text">Сообщения</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск пользователей..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {searchQuery ? (
            <div>
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="w-full p-4 hover:bg-gray-900 flex items-center gap-3 border-b border-gray-800"
                >
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 text-left">
                    <p className="font-semibold">@{user.username}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              {conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedUser(conv.otherUser)}
                  className="w-full p-4 hover:bg-gray-900 flex items-center gap-3 border-b border-gray-800"
                >
                  <img
                    src={conv.otherUser?.avatar}
                    alt={conv.otherUser?.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 text-left">
                    <p className="font-semibold">@{conv.otherUser?.username}</p>
                    <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Чат */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-800 flex items-center gap-3">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">@{selectedUser.username}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => {
                const isOwn = msg.senderId === userData?.id
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-800 text-white'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage()
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Написать сообщение..."
                  className="flex-1 px-4 py-2 bg-gray-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-smooth"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Выберите разговор</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

