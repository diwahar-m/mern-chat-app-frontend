import React, {useState} from 'react'
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    
    const [show, setShow] = useState(false);
    const [email, setMail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history  = useHistory();

    const submitHandler = async() =>{
      setLoading(true);
      if( !email || !password) {
        toast({
          title: 'Please fill all fields!',
          status: 'warning',
          duration: 5000,
          isCloseable: true,
          position: 'bottom'
        })
        setLoading(false);
        return;
      }

      try{
        const config = {
          headers: {
            'Content-type': 'application/json'
          }
        }
        const res =await axios.post('/api/user/login', { email, password }, config);
        const {data} = res;
        console.log( 'login response data: ', data)

        if(data){
          localStorage.setItem('userInfo', JSON.stringify(data));
          console.log('Login Response data: ', res)
          toast({
            title: 'Login successfull !',
            status: 'success',
            duration: 5000,
            isCloseable: true,
            position: 'bottom'
          });
          
          setLoading(false);
          history.push('/chats');
        }

      } catch(err){
        
        toast({
          title: 'Please enter right credentials!',
          status: 'error',
          duration: 5000,
          isCloseable: true,
          position: 'bottom'
        });
        setLoading(false);
        setMail('');
        setPassword('');
      }
        

    }


  return (
    <VStack spacing='5px'>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input type='email' placeholder='Enter Your Email' value={email} onChange={e => setMail(e.target.value)}/>
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
            <Input type={show ? 'text' : 'password'}
                onChange={e => setPassword(e.target.value)}
                value={password}
                placeholder='Enter Your Password'/>
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={()=> setShow(!show)}>
                {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
        </InputGroup>
      </FormControl>  

        <Button colorScheme='blue' width='100%' style={{ marginTop: 15}} isLoading={loading} onClick={submitHandler}> 
            Log in
        </Button>
        <Button variant='solid' colorScheme='red' width='100%'
            onClick={()=> {
                setMail('guest@example.com');
                setPassword('guest');
            }}    
        >
            Get Guest User Credentials 
        </Button>
    </VStack>
  )
}

export default Login
