import { useState, useCallback } from 'react'
import { VStack, Icon, useToast, FlatList } from 'native-base'
import { Octicons } from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { PoolCard, PoolCardPros } from '../components/PoolCard'
import { Loading } from '../components/Loading'
import { api } from '../services/api'
import { EmptyPoolList } from '../components/EmptyPoolList'

export default function Pools() {
  const [isLoading, setIsLoading] = useState(true)
  const [pools, setPools] = useState<PoolCardPros[]>([])
  const toast = useToast()
  const { navigate } = useNavigation()

  const onLoadDataPools = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data } = await api.get('/polls')

      if(data.polls.length > 0) setPools(data.polls)
    } catch (error) {
      console.log(error)
      toast.show({ title: 'Não foi possivel carregar os bolões', placement: 'bottom', bgColor: 'red.500'})
    } finally {
      setIsLoading(false)
    }
  }, [])

  useFocusEffect(useCallback(() => {
    onLoadDataPools()
  }, []))

  return (
    <VStack flex={1} bg='gray.900'>
      <Header title='Meus bolões' />
      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button onPress={() => navigate('find')} title='Buscar bolão por código' leftIcon={<Icon as={Octicons} name='search' color='black' size='md' />} />
      </VStack>
      {isLoading ? <Loading /> : (
        <FlatList
          data={pools}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <PoolCard data={item} />}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      )}
    </VStack>
  )
}
