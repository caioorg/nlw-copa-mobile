import { useCallback, useState } from 'react'
import { Heading, Text, VStack, useToast } from 'native-base'
import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import Logo from '../assets/logo.svg'
import { api } from '../services/api'

export default function New() {
  const toast = useToast()
  const [title, setTitle] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onHandlePoolCreate = useCallback(async() => {
    if(!title.trim()) return toast.show({ title: 'Informe um nome para seu bolão', placement: 'bottom', bgColor: 'red.500' })

    try {
      setIsLoading(true)
      
      await api.post('/polls', { title })

      toast.show({ title: 'Bolão criado com sucesso', placement: 'bottom', bgColor: 'green.500'})
      setTitle('')

    } catch (error) {
      toast.show({ title: 'Não foi possível criar o bolão', placement: 'bottom', bgColor: 'red.500' })
    } finally {
      setIsLoading(false)
    }
  }, [title])

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title='Criar novo bolão' />

      <VStack mt={8} mx={5} alignItems='center'>
        <Logo />
        <Heading fontFamily='heading' color='white' fontSize='xl' my={8} textAlign='center'>
          Crie seu próprio bolão da copa {'\n'} e compartilhe entre amigos!
        </Heading>

        <Input value={title} onChangeText={setTitle} mb={2} placeholder='Qual nome do seu bolão?' />
        <Button title='Criar meu bolão' onPress={onHandlePoolCreate} isLoading={isLoading} />

        <Text color='gray.200' fontSize='sm' textAlign='center' px={10} mt={4}>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  )
}
