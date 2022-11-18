import { Box, FlatList, useToast } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { Game, GameProps } from '../components/Game'
import { api } from '../services/api';
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Loading } from './Loading';

interface Props {
  poolId: string;
  code: string
  onShare(): void
}

export function Guesses({ poolId, code, onShare }: Props) {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [games, setGames] = useState<GameProps[]>([])
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')

  const onLoadGames = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      const response = await api.get(`/polls/${id}/games`)

      if(response.data.games.length > 0) setGames(response.data.games)

    } catch (error) {
      console.log(error)
      toast.show({ title: 'Não foi possivel carregar os jogos', placement: 'bottom', bgColor: 'red.500' })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    onLoadGames(poolId)
  }, [poolId])

  const onHandleGuessConfirme = useCallback(async (gameId: string) => {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({ title: 'Informe o placar do palpite', placement: 'bottom', bgColor: 'red.500' })
      }

      setIsLoading(true)

      await api.post(`/polls/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      })

      toast.show({ title: 'Palpite realizado com sucesso', placement: 'bottom', bgColor: 'green.500' })

      onLoadGames(poolId)

    } catch (error) {
      console.log(error.response.data)

      toast.show({ title: 'Não foi possivel enviar o palpite', placement: 'bottom', bgColor: 'red.500' })
    } finally {
      setIsLoading(false)
    }
  }, [firstTeamPoints, secondTeamPoints, poolId])

  if(isLoading) return <Loading />

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          firstTeamPoints={firstTeamPoints}
          secondTeamPoints={secondTeamPoints}
          data={item}
          onGuessConfirm={() => onHandleGuessConfirme(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} onShare={onShare} />}

    />
  );
}
