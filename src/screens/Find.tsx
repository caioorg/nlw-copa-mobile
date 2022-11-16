import { useCallback, useState } from 'react'
import { Heading, VStack, useToast } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { api } from '../services/api'

export default function Find () {
  const toast = useToast()
  const { navigate } = useNavigation()
  const [code, setCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onHandleJoinPool = useCallback( async () => {
    try {
      setIsLoading(true)
      if (!code.trim()) return toast.show({ title: 'Informe o código do bolão', placement: 'bottom', bgColor: 'red.500'})

      await api.post('/polls/join', { code })
      toast.show({ title: 'Você entrou no bolão com sucesso', placement: 'bottom', bgColor: 'green.500'})
      navigate('pools')

    } catch (error) {
      setIsLoading(false)
      
      const enumsErrors = {
        'Poll not found.': 'Não foi possível encontrar o bolão.',
        'You already joined this poll.': 'Ops! Você já está nesse bolão.'
      }

      if(error?.response?.data?.message) {
        return toast.show({ title: enumsErrors[error?.response?.data?.message], placement: 'bottom', bgColor: 'red.500'})
      }
      
      toast.show({ title: 'Ocorreu uma falha o buscar o bolão, tente novamente!', placement: 'bottom', bgColor: 'red.500'})
    }
  }, [code])

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title='Buscar por código' showBackButton />

      <VStack mt={8} mx={5} alignItems='center'>
        <Heading fontFamily='heading' color='white' fontSize='xl' mb={8} textAlign='center'>
          Encontre um bolão através de {'\n'} seu código único
        </Heading>

        <Input autoCapitalize='characters' value={code} onChangeText={setCode} mb={2} placeholder='Qual o código do bolão?' />
        <Button title='Buscar bolão' onPress={onHandleJoinPool} isLoading={isLoading} />
      </VStack>
    </VStack>
  )
}
