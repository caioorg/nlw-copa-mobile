import { HStack, useToast, VStack } from "native-base";
import { Share } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { Header } from "../components/Header";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { PoolCardPros } from '../components/PoolCard'
import { api } from "../services/api";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string
}

export default function Details() {
  const route = useRoute()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [detail, setDetail] = useState({} as PoolCardPros)
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses')
  const { id } = route.params as RouteParams

  const onLoadPoolDetails = useCallback(async (id: string) => {
    try {
      setIsLoading(true)

      const response = await api.get(`/polls/${id}`)

      if (response.data) setDetail(response.data.poll)

    } catch (error) {
      console.log(error)
      toast.show({ title: 'Não foi possivel carregar as informações do bolão!', placement: 'bottom', bgColor: 'red.500' })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    onLoadPoolDetails(id)
  }, [id])

  const onHandleCodeShare = useCallback(async () => {
    await Share.share({ message: detail.code })
  }, [detail])

  if(isLoading) return <Loading />

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title={detail.title} showBackButton showShareButton onShare={onHandleCodeShare} />
      {detail._count.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={detail} />
          <HStack bgColor='gray.800' p={1} rounded='sm' mb={5}>
            <Option title="Seus palpites" isSelected={optionSelected === 'guesses'} onPress={() => setOptionSelected('guesses')} />
            <Option title="Ranking do grupo" isSelected={optionSelected === 'ranking'} onPress={() => setOptionSelected('ranking')} />
          </HStack>
          <Guesses poolId={detail.id} code={detail.code} onShare={onHandleCodeShare} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={detail.code} onShare={onHandleCodeShare} />
      )}
    </VStack>
  )
}
