import { createContext, useContext, useState, useEffect } from 'react'
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp
} from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../config/firebase'

const DataContext = createContext()

export function useData() {
  return useContext(DataContext)
}

export function DataProvider({ children }) {
  const [videos, setVideos] = useState([])
  const [users, setUsers] = useState([])
  const [comments, setComments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [stories, setStories] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribeVideos, unsubscribeUsers, unsubscribeComments, unsubscribeNotifications, unsubscribeStories, unsubscribePlaylists

    try {
      unsubscribeVideos = onSnapshot(
        query(collection(db, 'videos'), orderBy('timestamp', 'desc')),
        (snapshot) => {
          setVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
          setLoading(false)
        },
        (error) => {
          console.error('Ошибка загрузки видео:', error)
          if (error.code === 'failed-precondition') {
            unsubscribeVideos = onSnapshot(
              collection(db, 'videos'),
              (snapshot) => {
                setVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => {
                  const aTime = a.timestamp?.toDate?.() || new Date(a.createdAt || 0)
                  const bTime = b.timestamp?.toDate?.() || new Date(b.createdAt || 0)
                  return bTime - aTime
                }))
                setLoading(false)
              },
              (err) => {
                console.error('Ошибка загрузки видео (fallback):', err)
                setLoading(false)
              }
            )
          } else {
            setLoading(false)
          }
        }
      )

      unsubscribeUsers = onSnapshot(
        collection(db, 'users'),
        (snapshot) => {
          setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        },
        (error) => {
          console.error('Ошибка загрузки пользователей:', error)
        }
      )

      unsubscribeComments = onSnapshot(
        query(collection(db, 'comments'), orderBy('timestamp', 'desc')),
        (snapshot) => {
          setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        },
        (error) => {
          console.error('Ошибка загрузки комментариев:', error)
          if (error.code === 'failed-precondition') {
            unsubscribeComments = onSnapshot(
              collection(db, 'comments'),
              (snapshot) => {
                setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => {
                  const aTime = a.timestamp?.toDate?.() || new Date(a.createdAt || 0)
                  const bTime = b.timestamp?.toDate?.() || new Date(b.createdAt || 0)
                  return bTime - aTime
                }))
              }
            )
          }
        }
      )

      unsubscribeNotifications = onSnapshot(
        query(collection(db, 'notifications'), orderBy('timestamp', 'desc')),
        (snapshot) => {
          setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        },
        (error) => {
          console.error('Ошибка загрузки уведомлений:', error)
          if (error.code === 'failed-precondition') {
            unsubscribeNotifications = onSnapshot(
              collection(db, 'notifications'),
              (snapshot) => {
                setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => {
                  const aTime = a.timestamp?.toDate?.() || new Date(a.createdAt || 0)
                  const bTime = b.timestamp?.toDate?.() || new Date(b.createdAt || 0)
                  return bTime - aTime
                }))
              }
            )
          }
        }
      )

      unsubscribeStories = onSnapshot(
        query(collection(db, 'stories'), orderBy('timestamp', 'desc')),
        (snapshot) => {
          setStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        },
        (error) => {
          console.error('Ошибка загрузки историй:', error)
          if (error.code === 'failed-precondition') {
            unsubscribeStories = onSnapshot(
              collection(db, 'stories'),
              (snapshot) => {
                setStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
              }
            )
          }
        }
      )

      unsubscribePlaylists = onSnapshot(
        collection(db, 'playlists'),
        (snapshot) => {
          setPlaylists(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        },
        (error) => {
          console.error('Ошибка загрузки плейлистов:', error)
        }
      )
    } catch (error) {
      console.error('Ошибка инициализации Firestore:', error)
      setLoading(false)
    }

    return () => {
      if (unsubscribeVideos) unsubscribeVideos()
      if (unsubscribeUsers) unsubscribeUsers()
      if (unsubscribeComments) unsubscribeComments()
      if (unsubscribeNotifications) unsubscribeNotifications()
      if (unsubscribeStories) unsubscribeStories()
      if (unsubscribePlaylists) unsubscribePlaylists()
    }
  }, [])

  const addVideo = async (videoFile, caption, hashtags, userId, username, userAvatar) => {
    try {
      const storageRef = ref(storage, `videos/${userId}/${Date.now()}_${videoFile.name}`)
      const uploadTask = uploadBytesResumable(storageRef, videoFile)

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Optional: track progress
          },
          (error) => {
            console.error("Upload failed:", error)
            reject({ success: false, error: error.message })
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            
            const hashtagArray = hashtags
              .split(' ')
              .filter(tag => tag.trim().startsWith('#'))
              .map(tag => tag.trim().substring(1))
              .filter(tag => tag.length > 0)

            const videoData = {
              userId,
              username,
              userAvatar,
              url: downloadURL,
              fileName: videoFile.name,
              fileSize: videoFile.size,
              fileType: videoFile.type,
              caption: caption || 'Без описания',
              hashtags: hashtagArray,
              likes: [],
              comments: [],
              reposts: [],
              views: 0,
              timestamp: serverTimestamp(),
              createdAt: new Date().toISOString()
            }

            const docRef = await addDoc(collection(db, 'videos'), videoData)
            resolve({ success: true, id: docRef.id })
          }
        )
      })
    } catch (error) {
      console.error('Ошибка создания видео:', error)
      return { success: false, error: error.message }
    }
  }

  const updateVideo = async (videoId, updates) => {
    try {
      await updateDoc(doc(db, 'videos', videoId), updates)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const deleteVideo = async (videoId) => {
    try {
      await deleteDoc(doc(db, 'videos', videoId))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const addComment = async (videoId, userId, username, avatar, text) => {
    try {
      const commentData = {
        videoId,
        userId,
        username,
        avatar,
        text,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      }

      const docRef = await addDoc(collection(db, 'comments'), commentData)
      
      const video = videos.find(v => v.id === videoId)
      if (video && video.userId !== userId) {
        await addNotification(
          video.userId,
          userId,
          'comment',
          `${username} прокомментировал ваше видео: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`
        )
      }

      return { success: true, id: docRef.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const toggleLike = async (videoId, userId) => {
    try {
      const video = videos.find(v => v.id === videoId)
      if (!video) return { success: false, error: 'Видео не найдено' }

      const isLiked = (video.likes || []).includes(userId)
      
      if (isLiked) {
        await updateDoc(doc(db, 'videos', videoId), {
          likes: arrayRemove(userId)
        })
      } else {
        await updateDoc(doc(db, 'videos', videoId), {
          likes: arrayUnion(userId)
        })

        if (video.userId !== userId) {
          const currentUser = users.find(u => u.id === userId)
          try {
            await addNotification(
              video.userId,
              userId,
              'like',
              `${currentUser?.username || 'Пользователь'} поставил лайк вашему видео`
            )
          } catch (notifError) {
            console.error('Ошибка добавления уведомления:', notifError)
          }
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Ошибка toggleLike:', error)
      return { success: false, error: error.message }
    }
  }

  const toggleRepost = async (videoId, userId) => {
    try {
      const video = videos.find(v => v.id === videoId)
      if (!video) return { success: false }

      const isReposted = (video.reposts || []).includes(userId)
      
      if (isReposted) {
        await updateDoc(doc(db, 'videos', videoId), {
          reposts: arrayRemove(userId)
        })
      } else {
        await updateDoc(doc(db, 'videos', videoId), {
          reposts: arrayUnion(userId)
        })
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const toggleFollow = async (targetUserId, currentUserId) => {
    try {
      const targetUser = users.find(u => u.id === targetUserId)
      if (!targetUser) return { success: false }

      const isFollowing = (targetUser.followers || []).includes(currentUserId)
      
      if (isFollowing) {
        await updateDoc(doc(db, 'users', targetUserId), {
          followers: arrayRemove(currentUserId)
        })
        await updateDoc(doc(db, 'users', currentUserId), {
          following: arrayRemove(targetUserId)
        })
      } else {
        await updateDoc(doc(db, 'users', targetUserId), {
          followers: arrayUnion(currentUserId)
        })
        await updateDoc(doc(db, 'users', currentUserId), {
          following: arrayUnion(targetUserId)
        })

        const currentUserData = users.find(u => u.id === currentUserId)
        await addNotification(
          targetUserId,
          currentUserId,
          'follow',
          `${currentUserData?.username || 'Пользователь'} подписался на вас`
        )
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const toggleFavorite = async (videoId, userId) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!user) return { success: false }

      const favorites = user.favorites || []
      const isFavorited = favorites.includes(videoId)
      
      if (isFavorited) {
        await updateDoc(doc(db, 'users', userId), {
          favorites: arrayRemove(videoId)
        })
      } else {
        await updateDoc(doc(db, 'users', userId), {
          favorites: arrayUnion(videoId)
        })
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const incrementViews = async (videoId) => {
    try {
      await updateDoc(doc(db, 'videos', videoId), {
        views: increment(1)
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const addNotification = async (userId, fromUserId, type, message) => {
    try {
      const notificationData = {
        userId,
        fromUserId,
        type,
        message,
        read: false,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      }
      await addDoc(collection(db, 'notifications'), notificationData)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const markNotificationAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const updateUser = async (userId, updates) => {
    try {
      await updateDoc(doc(db, 'users', userId), updates)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const addStory = async (mediaFile, userId, username, userAvatar) => {
    try {
      const storageRef = ref(storage, `stories/${userId}/${Date.now()}_${mediaFile.name}`)
      const uploadTask = uploadBytesResumable(storageRef, mediaFile)

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.error("Upload failed:", error)
            reject({ success: false, error: error.message })
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

            const storyData = {
              userId,
              username,
              userAvatar,
              mediaUrl: downloadURL,
              mediaType: mediaFile.type.startsWith('video/') ? 'video' : 'image',
              views: [],
              timestamp: serverTimestamp(),
              createdAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            }

            const docRef = await addDoc(collection(db, 'stories'), storyData)
            resolve({ success: true, id: docRef.id })
          }
        )
      })
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const createPlaylist = async (name, userId, description = '') => {
    try {
      const playlistData = {
        name,
        description,
        userId,
        videos: [],
        createdAt: serverTimestamp()
      }
      const docRef = await addDoc(collection(db, 'playlists'), playlistData)
      return { success: true, id: docRef.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const addVideoToPlaylist = async (playlistId, videoId) => {
    try {
      await updateDoc(doc(db, 'playlists', playlistId), {
        videos: arrayUnion(videoId)
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const searchVideos = (query) => {
    if (!query.trim()) return videos
    const lowerQuery = query.toLowerCase()
    return videos.filter(video => 
      video.caption?.toLowerCase().includes(lowerQuery) ||
      video.hashtags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  const searchUsers = (query) => {
    if (!query.trim()) return users
    const lowerQuery = query.toLowerCase()
    return users.filter(user =>
      user.username?.toLowerCase().includes(lowerQuery) ||
      user.email?.toLowerCase().includes(lowerQuery)
    )
  }

  const toggleCommentReaction = async (commentId, userId, reactionType) => {
    try {
      const comment = comments.find(c => c.id === commentId)
      if (!comment) return { success: false }

      const reactions = comment.reactions || {}
      const reactionArray = reactions[reactionType] || []
      const isReacted = reactionArray.includes(userId)

      if (isReacted) {
        await updateDoc(doc(db, 'comments', commentId), {
          [`reactions.${reactionType}`]: arrayRemove(userId)
        })
      } else {
        await updateDoc(doc(db, 'comments', commentId), {
          [`reactions.${reactionType}`]: arrayUnion(userId)
        })
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const blockUser = async (userId, blockedUserId) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!user) return { success: false }

      const blocked = user.blocked || []
      if (blocked.includes(blockedUserId)) {
        await updateDoc(doc(db, 'users', userId), {
          blocked: arrayRemove(blockedUserId)
        })
      } else {
        await updateDoc(doc(db, 'users', userId), {
          blocked: arrayUnion(blockedUserId)
        })
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const getVideoStats = (videoId) => {
    const video = videos.find(v => v.id === videoId)
    if (!video) return null

    return {
      views: video.views || 0,
      likes: video.likes?.length || 0,
      comments: comments.filter(c => c.videoId === videoId).length,
      reposts: video.reposts?.length || 0,
      engagement: ((video.likes?.length || 0) + (video.comments?.length || 0) + (video.reposts?.length || 0)) / Math.max(video.views || 1, 1) * 100
    }
  }

  const value = {
    videos,
    users,
    comments,
    notifications,
    stories,
    playlists,
    loading,
    addVideo,
    updateVideo,
    deleteVideo,
    addComment,
    toggleLike,
    toggleRepost,
    toggleFollow,
    toggleFavorite,
    incrementViews,
    addNotification,
    markNotificationAsRead,
    updateUser,
    addStory,
    createPlaylist,
    addVideoToPlaylist,
    searchVideos,
    searchUsers,
    toggleCommentReaction,
    blockUser,
    getVideoStats
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
