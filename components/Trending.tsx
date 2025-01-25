import { icons } from '@/constants';
import { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { Video, ResizeMode } from 'expo-av'

interface TrendingProps {
  posts: any
}

interface TrendingItemProps {
  activeItem: any;
  item: any;
}

const zoomIn = {
  0: {
    scale: 0.9
  },
  1: {
    scale: 1.1
  }
}

const zoomOut = {
  0: {
    scale: 1.1
  },
  1: {
    scale: 0.9
  }
}

const TrendingItem: React.FC<TrendingItemProps> = ({
  activeItem,
  item
}) => {

  const [play, setPlay] = useState(false)

  return (
    <Animatable.View className='mx-4' animation={activeItem === item.$id ? zoomIn : zoomOut} duration={500}>
      {play ? (
        <Video source={{ uri: item.video }} style={{ width: 205, height: 275 }}  className='w-52 h-72 rounded-[35px] mt-3 bg-white/10' resizeMode={ResizeMode.CONTAIN} useNativeControls shouldPlay onPlaybackStatusUpdate={(status: any) => {
          if (status.didJustFinish) {
            setPlay(false)
          }
        }}/>
      ) : (
        <TouchableOpacity className='relative justify-center items-center' activeOpacity={0.7} onPress={() => setPlay(true)}>

          <ImageBackground source={{ uri: item.thumbnail }} className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40' resizeMode='cover'/>

          <Image source={icons.play} className='w-12 h-12 absolute' resizeMode='contain'/>

        </TouchableOpacity>
      )}
    </Animatable.View>
  )
}

const Trending: React.FC<TrendingProps> = ({
  posts
}) => {

  const [activeItem, setActiveItem] = useState(posts[1])

  const viewableItemsChanged = ({ viewableItems }: any) => {
    
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key)
    }
  }

  return (
    <FlatList data={posts} keyExtractor={(item) => item.$id} renderItem={({item}) => (
          <TrendingItem activeItem={activeItem} item={item}/>
        )} horizontal onViewableItemsChanged={viewableItemsChanged} viewabilityConfig={{
          itemVisiblePercentThreshold: 100
        }} contentOffset={{ x: 0, y: 0 }}/>
  )
}

export default Trending