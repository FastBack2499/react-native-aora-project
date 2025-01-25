import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite'

export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.fast.aora',
  projectId: '67572aac002e4a65ee07',
  databaseId: '67572ca40039e263c598',
  userCollectionId: '67572cc300025f2fcefc',
  videoCollectionId: '67572cdb0034b83407e2',
  storageId: '67572e430022d2b58f21'
}

const client = new Client()

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform)

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)

export const createUser = async ( email: string , password: string , username: string ) => {

  try {

    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    )

    if(!newAccount) throw Error

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
      }
    )

    return newUser

  } catch (error: any) {
    console.log(error)
    throw new Error(error)
  }

}

export const signIn = async ( email: string, password: string ) => {
  try {

    const session = await account.createEmailPasswordSession(email, password)

    return session
    
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getCurrentUser = async () => {
  try {

    const currentAccount = await account.get()

    if(!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if(!currentUser) throw Error

    return currentUser.documents[0]

  } catch (error) {
    console.log(error)
  }
}

export const getAllPosts = async () => {
  try {

    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt')]
    )
    
    return posts.documents

  } catch (error: any) {
    throw new Error(error)
  }
}

export const getLatestPosts = async () => {
  try {

    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(7)]
    )
    
    return posts.documents

  } catch (error: any) {
    throw new Error(error)
  }
}

export const searchPosts = async (query: any) => {
  try {

    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search('title', query)]
    )
    
    return posts.documents

  } catch (error: any) {
    throw new Error(error)
  }
}

export const getUserPosts = async (userId: any) => {
  try {

    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
    )
    
    return posts.documents

  } catch (error: any) {
    throw new Error(error)
  }
}

export const signOut = async () => {
  try {
    
    const session = await account.deleteSession('current')
    return session
    
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getFilePreview = async (fileId: any, type: any) => {
  let fileUrl

  try {

    if (type === 'video') {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId)
    } else if (type === 'image') {
      fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, "top" , 100)
    } else {
      throw new Error('Invalid File Type!!')
    }

    if (!fileUrl) throw Error

    return fileUrl

  } catch (error: any) {
    throw new Error(error)
  }
}

export const uploadFile = async (file: any, type: string) => {
  if (!file) return

  const asset = { 
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
   }

  try {

    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    )

    const fileUrl = await getFilePreview(uploadedFile.$id, type)

    return fileUrl

  } catch (error: any) {
    throw new Error(error)
  }
}

export const createVideo = async (form: {
  title: string,
  video: any,
  thumbnail: any,
  prompt: string,
  userId: string
}) => {

  try {

    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video'),
    ])

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId
      }
    )

    return newPost

  } catch (error: any) {
    throw new Error(error)
  }

}