import React,{useEffect} from 'react';
import {Container, Box, Text, Tab, Tabs, TabList,TabPanel,  TabPanels} from '@chakra-ui/react';
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import { useHistory } from 'react-router-dom';


const HomePage = () => {

  const history = useHistory();

  
  useEffect(()=>{
    let user= JSON.parse(localStorage.getItem('userInfo'));
    if(user) history.push('/chats')
  },[])

  return (
    <Container maxW="xl" centerContent>
      <Box
        textAlign="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth='1px'
      >
          <Text fontSize="4xl" fontFamily="work sans" color="black">Talk-A-Tive</Text>
      </Box>

      <Box color='black' bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px' >
        <Tabs variant='soft-rounded' >
          <TabList mb='1em'>
            <Tab width='50%'>Login</Tab>
            <Tab  width='50%'>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
