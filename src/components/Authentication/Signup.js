import React, {useState} from 'react';
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

const Signup = () => {

    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setMail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history  = useHistory();

    const preset_key = 'mern-chat-app';
    const cloud_name='dx1hxk1dn';

    const postDetails=  (pics) =>{
      setLoading(true); 
      if(pics == undefined){
        toast({
          title: 'Please select an image!',
          status: 'warning',
          duration: 5000,
          isCloseable: true,
          position: 'bottom'
        })
        return;
      }

      if(pics.type === 'image/png' || pics.type === 'image/jpeg'){
        const formData = new FormData();
        formData.append('file', pics);
        formData.append('upload_preset', preset_key);
        axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData)
        .then( ({data}) =>{
          setPic(data.secure_url.toString());
          console.log(data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        })
      
      }else{
        toast({
          title: 'Please select an image!',
          status: 'warning',
          duration: 5000,
          isCloseable: true,
          position: 'bottom'
        });
        setLoading(false);
        return ;
      }

    }

    const submitHandler = async()=>{
      setLoading(true);
      if( !name || !email || !password || !confirmPassword){
        toast({
          title: 'Please fill all the fields!',
          status: 'warning',
          duration: 5000,
          isCloseable: true,
          position: 'bottom'
        });
        setLoading(false);
        return ;
      }
      if( password !== confirmPassword){
        toast({
          title: 'Passwords do not match!',
          status: 'warning',
          duration: 5000,
          isCloseable: true,
          position: 'bottom'
        });
        
        setLoading(false);
        return ;
      }

      try{
        const config = {
          headers: {
            'Content-type': 'application/json'
          }
        }

        const {data} =await axios.post('/api/user', {name, email, password, pic}, config)
        localStorage.setItem('userInfo', JSON.stringify(data));
        toast({
          title: 'registration successfull!',
          status: 'success',
          duration: 5000,
          isCloseable: true,
          position: 'bottom'
        });
        
        setLoading(false);
        history.push('/chats');

      }catch(err){
        toast({
          title: 'Error Occurred!',
          status: err.response.data.message,
          duration: 5000,
          isCloseable: true,
          position: 'bottom'
        });
        setLoading(false);

      }
    }


  return (
    <VStack spacing='5px'>
      <FormControl id='name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder='Enter Your Name' onChange={e => setName(e.target.value)}/>
      </FormControl>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input type='email' placeholder='Enter Your Email' onChange={e => setMail(e.target.value)}/>
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
            <Input type={show ? 'text' : 'password'}
                onChange={e => setPassword(e.target.value)}
                placeholder='Enter Your Password'/>
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={()=> setShow(!show)}>
                {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
        </InputGroup>
      </FormControl>  
      
      <FormControl id='confirm-password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
            <Input type={show ? 'text' : 'password'}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder='Confirm Your Password'/>
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={()=> setShow(!show)}>
                {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
        </InputGroup>
        
      </FormControl>
      <FormControl id='name' isRequired>
        <FormLabel>Upload your Picture</FormLabel>
        <Input type='file' p={1.5} 
        accept='image/*' onChange={e => postDetails(e.target.files[0])}/>
      </FormControl>

        <Button colorScheme='blue' width='100%' style={{ marginTop: 15}} isLoading = {loading} onClick={submitHandler}> 
            Sign Up
        </Button>
    </VStack>
  )
}

export default Signup
